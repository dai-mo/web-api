// The Play plugin
addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.5.3")

// Web plugins

addSbtPlugin("com.typesafe.sbt" % "sbt-coffeescript" % "1.0.0")

addSbtPlugin("com.typesafe.sbt" % "sbt-less" % "1.1.0")

addSbtPlugin("com.typesafe.sbt" % "sbt-jshint" % "1.0.3")

addSbtPlugin("com.typesafe.sbt" % "sbt-rjs" % "1.0.7")

addSbtPlugin("com.typesafe.sbt" % "sbt-digest" % "1.1.0")

addSbtPlugin("com.typesafe.sbt" % "sbt-mocha" % "1.1.0")

addSbtPlugin("org.irundaia.sbt" % "sbt-sassify" % "1.4.2")

addSbtPlugin("net.virtual-void" % "sbt-dependency-graph" % "0.8.2")

addSbtPlugin("com.typesafe.sbt" % "sbt-gzip" % "1.0.0")

// provides server side compilation of typescript to ecmascript 5 or 3
addSbtPlugin("name.de-vries" % "sbt-typescript"  % "0.3.0-beta.1")

// checks your typescript code for error prone constructions
addSbtPlugin("name.de-vries" % "sbt-tslint" % "0.9.7")

// Release / Versioning PLugins

addSbtPlugin("com.eed3si9n" % "sbt-buildinfo" % "0.6.1")

addSbtPlugin("com.typesafe.sbt" % "sbt-git" % "0.8.5")

addSbtPlugin("com.github.gseitz" % "sbt-release" % "1.0.3")
