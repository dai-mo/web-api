import sbt._


import sbtrelease._
import sbtrelease.ReleaseStateTransformations.{setReleaseVersion=>_,_}

name := "org.dcs.web"

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

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  "org.dcs" % "org.dcs.api" % "1.0.0-SNAPSHOT",
  "org.dcs" % "org.dcs.remote" % "1.0.0-SNAPSHOT",
  "org.dcs" % "org.dcs.flow" % "0.0.1-SNAPSHOT",
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test
)

libraryDependencies ++= Seq(
  "org.webjars" %% "webjars-play" % "2.5.0",
  "org.webjars" % "angularjs" % "1.5.3",
  "org.webjars" % "angular-ui-bootstrap" % "1.3.3",
  "org.webjars.bower" % "html5-boilerplate" % "5.2.0",
  "org.webjars" % "font-awesome" % "4.6.3",
  "org.webjars" % "visjs" % "4.8.2",
  "org.webjars" % "bootstrap" % "3.3.6" exclude("org.webjars", "jquery"),
  "org.webjars" % "requirejs" % "2.1.14-1" exclude("org.webjars", "jquery"),
  "org.webjars" % "requirejs-domready" % "2.0.1-2"
)

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
buildInfoPackage := "org.dcs.web"

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


// sbt release
def setVersionOnly(selectVersion: Versions => String): ReleaseStep =  { st: State =>
  val vs = st.get(ReleaseKeys.versions).getOrElse(sys.error("No versions are set! Was this release part executed before inquireVersions?"))
  val selected = selectVersion(vs)

  st.log.info("Setting version to '%s'." format selected)
  val useGlobal =Project.extract(st).get(releaseUseGlobalVersion)
  val versionStr = (if (useGlobal) globalVersionString else versionString) format selected

  reapply(Seq(
    if (useGlobal) version in ThisBuild := selected
    else version := selected
  ), st)
}

lazy val setReleaseVersion: ReleaseStep = setVersionOnly(_._1)

releaseVersion <<= (releaseVersionBump)( bumper=>{
  ver => Version(ver)
    .map(_.withoutQualifier.string).getOrElse(versionFormatError)
})

val showReleaseVersion = settingKey[String]("The future version once releaseVersion has been applied to it")
val showNextVersion = settingKey[String]("The future version once releaseNextVersion has been applied to it")

showReleaseVersion <<= (version, releaseVersion)((v,f)=>f(v))
showNextVersion <<= (version, releaseNextVersion)((v,f)=>f(v))

releaseProcess := Seq(
  checkSnapshotDependencies,
  inquireVersions,
  setReleaseVersion,
  runTest,
  tagRelease,
  ReleaseStep(releaseStepTask(publish in Universal)),
  pushChanges
)