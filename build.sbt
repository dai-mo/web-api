import sbt._


import sbtrelease._
import sbtrelease.ReleaseStateTransformations.{setReleaseVersion=>_,_}

val projectName = "org.dcs.web"
name := projectName

lazy val web = (project in file(".")).enablePlugins(PlayScala, BuildInfoPlugin, GitVersioning, GitBranchPrompt).
  settings(
  // Disable NPM node modules
  JsEngineKeys.npmNodeModules in Assets := Nil,
  JsEngineKeys.npmNodeModules in TestAssets := Nil
)
scalaVersion := "2.11.7"

crossPaths := false

Common.commonSettings

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

JsEngineKeys.engineType := JsEngineKeys.EngineType.Node

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  filters,
  "org.dcs" % "org.dcs.api" % "0.2.0-SNAPSHOT",
  "org.dcs" % "org.dcs.remote" % "0.2.0-SNAPSHOT",
  "org.dcs" % "org.dcs.flow" % "0.2.0-SNAPSHOT",
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test
)
val ngVersion="2.0.0-rc.4"

libraryDependencies ++= Seq(
  "org.webjars" %% "webjars-play" % "2.5.0",
  "org.webjars.bower" % "html5-boilerplate" % "5.2.0",
  "org.webjars" % "font-awesome" % "4.6.3",
  "org.webjars" % "visjs" % "4.8.2",
  "org.webjars" % "bootstrap" % "3.3.6" exclude("org.webjars", "jquery"),

  //angular2 dependencies
  "org.webjars.npm" % "angular__common" % ngVersion,
  "org.webjars.npm" % "angular__compiler" % ngVersion,
  "org.webjars.npm" % "angular__core" % ngVersion,
  "org.webjars.npm" % "angular__forms" % "0.2.0",
  "org.webjars.npm" % "angular__http" % ngVersion,
  "org.webjars.npm" % "angular__router" % "3.0.0-beta.2",
  "org.webjars.npm" % "angular__router-deprecated" % "2.0.0-rc.2",
  "org.webjars.npm" % "angular__upgrade" % "2.0.0-rc.4",
  "org.webjars.npm" % "angular__platform-browser-dynamic" % ngVersion,
  "org.webjars.npm" % "angular__platform-browser" % ngVersion,


  "org.webjars.npm" % "reflect-metadata" % "0.1.3",
  "org.webjars.npm" % "systemjs" % "0.19.31",
  "org.webjars.npm" % "todomvc-common" % "1.0.2",
  "org.webjars.npm" % "rxjs" % "5.0.0-beta.9",
  "org.webjars.npm" % "es6-promise" % "3.1.2",
  "org.webjars.npm" % "es6-shim" % "0.35.1",
  "org.webjars.npm" % "reflect-metadata" % "0.1.3",
  "org.webjars.npm" % "zone.js" % "0.6.12",
  "org.webjars.npm" % "core-js" % "2.4.0",
  "org.webjars.npm" % "symbol-observable" % "1.0.1",
  "org.webjars.npm" % "angular2-in-memory-web-api" % "0.0.14",

  "org.webjars.npm" % "typescript" % "2.0.0-dev.20160707",

  //tslint dependency
  "org.webjars.npm" % "tslint-eslint-rules" % "1.2.0",
  "org.webjars.npm" % "codelyzer" % "0.0.19",
  "org.webjars.npm" % "types__jasmine" % "2.2.26-alpha" % "test"
)

dependencyOverrides += "org.webjars.npm" % "minimatch" % "3.0.0"

// the typescript typing information is by convention in the typings directory
// It provides ES6 implementations. This is required when compiling to ES5.
typingsFile := Some(baseDirectory.value / "typings" / "index.d.ts")

// use the webjars npm directory (target/web/node_modules ) for resolution of module imports of angular2/core etc
resolveFromWebjarsNodeModulesDir := true

// use the combined tslint and eslint rules plus ng2 lint rules
(rulesDirectories in tslint) := Some(List(
  tslintEslintRulesDir.value  //,    disable codelyzer until it supports ts 2.0
  //  ng2LintRulesDir.value
))

pipelineStages := Seq(rjs, digest, gzip)

crossPaths := false


publish <<= (publish) dependsOn  dist

publishLocal <<= (publishLocal) dependsOn dist

publishM2 <<= (publishM2) dependsOn dist

val publishDist = TaskKey[File]("publishDist", "Publish dist zip file")

artifact in publishDist ~= { (art: Artifact) => art.copy(`type` = "zip", extension = "zip") }

val publishDistSettings = Seq[Setting[_]] (
  publishDist <<= (target in Universal, normalizedName, version) map { (targetDir, id, version) =>
    val packageName = "%s-%s" format(id, version)
    targetDir / (packageName + ".zip")
  }) ++ Seq(addArtifact(artifact in publishDist, publishDist).settings: _*)

Seq(publishDistSettings: _*)




scalacOptions in ThisBuild ++= Seq(
  "-target:jvm-1.8",
  "-encoding", "UTF-8",
  "-deprecation", // warning and location for usages of deprecated APIs
  "-feature", // warning and location for usages of features that should be imported explicitly
  "-unchecked", // additional warnings where generated code depends on assumptions
  "-Xlint", // recommended additional warnings
  "-Ywarn-adapted-args", // Warn if an argument list is modified to match the receiver
  "-Ywarn-value-discard", // Warn when non-Unit expression results are unused
  "-Ywarn-inaccessible",
  "-Ywarn-dead-code",
  "-language:reflectiveCalls"
)

fork in run := true

// ------- Versioning , Release Section --------

// Build Info
buildInfoKeys := Seq[BuildInfoKey](name, version, scalaVersion, sbtVersion)
buildInfoPackage := projectName

// Git
showCurrentGitBranch

git.useGitDescribe := true

git.baseVersion := "0.0.0"

val VersionRegex = "v([0-9]+.[0-9]+.[0-9]+)-?(.*)?".r

git.gitTagToVersionNumber := {
  case VersionRegex(v,"SNAPSHOT") => Some(s"$v-SNAPSHOT")
  case VersionRegex(v,"") => Some(v)
  case VersionRegex(v,s) => Some(s"$v-$s-SNAPSHOT")
  case v => None
}

lazy val bumpVersion = settingKey[String]("Version to bump - should be one of \"None\", \"Major\", \"Patch\"")
bumpVersion := "None"

releaseVersion := {
  ver => bumpVersion.value.toLowerCase match {
    case "none" => Version(ver).
      map(_.withoutQualifier.string).
      getOrElse(versionFormatError)
    case "major" => Version(ver).
      map(_.withoutQualifier).
      map(_.bump(sbtrelease.Version.Bump.Major).string).
      getOrElse(versionFormatError)
    case "patch" => Version(ver).
      map(_.withoutQualifier).
      map(_.bump(sbtrelease.Version.Bump.Bugfix).string).
      getOrElse(versionFormatError)
    case _ => sys.error("Unknown bump version - should be one of \"None\", \"Major\", \"Patch\"")
  }
}

releaseVersionBump := sbtrelease.Version.Bump.Minor