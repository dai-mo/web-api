name := """org.dcs.web"""

version := "1.0.0-SNAPSHOT"

lazy val web = (project in file(".")).enablePlugins(PlayScala)

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

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"
