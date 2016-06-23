import sbt._

name := """org.dcs.web"""

version := "1.0.0-SNAPSHOT"

scalaVersion := "2.11.7"

crossPaths := false

Common.commonSettings

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

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

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


lazy val web = (project in file(".")).enablePlugins(PlayScala).settings(
  // Disable NPM node modules
  JsEngineKeys.npmNodeModules in Assets := Nil,
  JsEngineKeys.npmNodeModules in TestAssets := Nil
)

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