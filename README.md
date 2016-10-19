

Javascript Dependency Management
================================

Dependency management of javascript libraries is currently managed by ```npm```

To add a new javascript dependency
    * add the dependency to 'package.json'
    * run the command ```npm install``` (this will install the dependency in the 'node_modules directory')
    * run the command ```sbt resolveNpm``` (this will copy the dependency to the relevant play assets directory)

To add new typings for a non-modularised javascript library,
 * Add the dt reference for the relevant project in the 'typings.json' file
 * run 'npm run typings install' (this will add the typings file in the corresponding directory under 'typings/globals' and add a reference to the 'globals/index.d.ts' file)
