import java.io.File

import sbt._
import sbtrelease._
import sbtrelease.ReleaseStateTransformations._

val projectName = "org.dcs.web"
name := projectName

lazy val UNIT = sbt.config("unit") extend Test
lazy val IT = sbt.config("it") extend Test

lazy val web = Project("web", file(".")).
  enablePlugins(PlayScala, BuildInfoPlugin, GitVersioning, GitBranchPrompt).
  configs(IT).
  settings(inConfig(IT)(Defaults.testTasks): _*).
  settings(testOptions in IT := Seq(Tests.Argument("-n", "IT"))).
  configs(UNIT).
  settings(inConfig(UNIT)(Defaults.testTasks): _*).
  settings(testOptions in UNIT := Seq(
    Tests.Argument("-l", "IT"),
    Tests.Argument("-l", "E2E")
  )
  )
scalaVersion := "2.11.7"

updateOptions := updateOptions.value.withCachedResolution(true)

crossPaths := false

Common.commonSettings

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"


libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  filters,

  "org.dcs"                  % "org.dcs.commons"          % "0.3.0",
  "org.dcs"                  % "org.dcs.api"              % "0.4.0",
  "org.dcs"                  % "org.dcs.remote"           % "0.4.0",
  "org.dcs"                  % "org.dcs.flow"             % "0.4.0",

  "org.webjars"             %% "webjars-play"             % "2.5.0",
  "io.jsonwebtoken"          % "jjwt"                     % "0.7.0",
  "org.keycloak"             % "keycloak-authz-client"    % "2.4.0.Final",

  "org.scalatestplus.play"  %% "scalatestplus-play"       % "1.5.1" % Test,
  "org.mockito"              % "mockito-core"             % "2.2.1" % Test
)


//publish <<= (publish) dependsOn  dist
//
//publishLocal <<= (publishLocal) dependsOn dist
//
//publishM2 <<= (publishM2) dependsOn dist
//
//val publishDist = TaskKey[File]("publishDist", "Publish dist zip file")
//
//artifact in publishDist ~= { (art: Artifact) => art.copy(`type` = "zip", extension = "zip") }
//
//val publishDistSettings = Seq[Setting[_]] (
//  publishDist <<= (target in Universal, normalizedName, version) map { (targetDir, id, version) =>
//    val packageName = "%s-%s" format(id, version)
//    targetDir / (packageName + ".zip")
//  }) ++ Seq(addArtifact(artifact in publishDist, publishDist).settings: _*)
//
//Seq(publishDistSettings: _*)


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

releaseProcess := Seq[ReleaseStep](
  checkSnapshotDependencies,              // : ReleaseStep
  inquireVersions,                        // : ReleaseStep
  runTest,                                // : ReleaseStep
  setReleaseVersion,                      // : ReleaseStep
  commitReleaseVersion,                   // : ReleaseStep, performs the initial git checks
  tagRelease,                             // : ReleaseStep
  ReleaseStep(releaseStepTask(publish in Universal)),
  setNextVersion,                         // : ReleaseStep
  commitNextVersion,                      // : ReleaseStep
  pushChanges                             // : ReleaseStep, also checks that an upstream branch is properly configured
)
