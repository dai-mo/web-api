
import sbt.Keys._
import sbt._


object Common {
  lazy val commonSettings = Seq(
    organization := "org.dcs",
    scalaVersion := "2.11.7",
    crossPaths := false,
    checksums in update := Nil,
    javacOptions ++= Seq("-source", "1.8", "-target", "1.8", "-Xlint:unchecked"),
    javacOptions in doc := Seq("-source", "1.8"),
    scalacOptions ++= Seq("-target:jvm-1.8",
      "-encoding", "UTF-8",
      "-deprecation", // warning and location for usages of deprecated APIs
      "-feature", // warning and location for usages of features that should be imported explicitly
      "-unchecked", // additional warnings where generated code depends on assumptions
      "-Xlint", // recommended additional warnings
      "-Ywarn-adapted-args", // Warn if an argument list is modified to match the receiver
      "-Ywarn-value-discard", // Warn when non-Unit expression results are unused
      "-Ywarn-inaccessible",
      "-Ywarn-dead-code",
      "-language:reflectiveCalls")
    )
}