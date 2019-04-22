#Config
The config folder contains items required for setting up a developer local workspace.

##mongo_seed
* This folder should contain any JSON files needed to seed the local mongo database using the gulp seed-mongo task.
* These files should be identical to the production files (found in the ./deployment/mongo_data folder, except that they may be a subset of larger data sets)
* The files will be automatically created by the csv-convert-[collection] gulp task.

##.eslintrc
This is the lint config file which is used when running lint tests

## CodeStyleSettings_Webstorm.jar
Import these settings to your Webstorm workspace to configure code styles to match the expected standards
