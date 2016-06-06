=== MapReduce - Site - Readme

=== Introduction ===
This project consists of a site that produces animation of currently, three MapReduce 
algorithm animations:

1. Word Count
2. Mean
3. Relative Frequencies

=== Installation ===
The application uses Node Package Manager (NPM) to run the site and therefore requires 
one to run certain commands prior to running the site, through its 'Index.html' file which
is the Homepage. 

The below instructions specify how to run the site:

1. Download the web application project.
2. Load the command prompt (cmd) and change directory (cd) to the outer site's directory - 
	i.e. 'MapReduce - Site'.
3. Run the following command: npm install

This will create a new 'node_modules' folder in the site's folder that will contain all 
the packages that the application requires.

=== Running the Tests and Code Coverage ===
Assuming that you have performed the above instructions, specified in the 'Installation' 
section, you need to carry out the below instructions to run the tests and the code 
coverage report.

1. Load the command prompt (cmd) and 'cd' to the 'MapREduce - Site' directory. 
	(same as step 1 and 2 above)
2. Run the following command : karma start.

All the test descriptions should be outputted in the same command window, showing the
tests that passed/failed.

A new 'coverage' folder will also be created in the site's directory. Open the folder and 
its subfolder ('Chrome...') and double click on the 'index.html' file. This will run the
code coverage report on your browser, showing which code has been covered through tests, 
and which code is 'vulnerable'.

It is important to note that some of the functions are animation functions, manipulating
the DOM and thus, did not require testing. As a result, these are reported as 'not covered'
in the coverage report.

Note: the tests are currently set to run on the 'Chrome' browser.