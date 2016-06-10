name := """org.dcs.web"""

version := "1.0.0-SNAPSHOT"

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  "org.dcs" % "org.dcs.api" % "1.0.0-SNAPSHOT",
  "org.dcs" % "org.dcs.remote" % "1.0.0-SNAPSHOT",
  "org.dcs" % "org.dcs.flow" % "0.0.1-SNAPSHOT",
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test
)

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
