'use strict';

// Register any short path names defined in package.json
require('module-alias/register');

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const istanbul = require('gulp-istanbul');
const runSequence = require('run-sequence');


// Run eslint tests
gulp.task('lint', () => {
  // Run on all js files except those in the node_modules or reports directories
  return gulp.src(['**/*.js', '!node_modules/**', '!coverage/**'])
    // Run lint with the config file
    .pipe(eslint('./config/.eslintrc'))
    // Print any error or warning details to the console
    .pipe(eslint.format())
    // Print a summary to the console
    .pipe(eslint.results(results => {
      console.log('Total Results: ' + results.length);
      console.log('Total Warnings: ' + results.warningCount);
      console.log('Total Errors: ' + results.errorCount);
    }))
    .pipe(eslint.failAfterError());
});

// Tasks to run before code commit is permitted.  If any of these fail, commit cannot complete
gulp.task('preCommit', () => {
  runSequence('test-unit', 'lint', error => {
    // If any error happened in the previous tasks, exit with a code > 0
    if (error) {
      console.log('[ERROR] gulp preCommit task failed', error.message);
      console.log('[FAIL] gulp preCommit task failed - exiting with code 1');

      return process.exit(1);
    }

    console.log('preCommit tasks passed, exiting with code 0');

    return process.exit(0);
  });
});


// Run all tests in the test/unit directory
gulp.task('test-unit', () => {
  return gulp.src(['./test/unit/**/*.js'])
    .pipe(mocha({
      bail: true,
      checkLeaks: true
    }));
});


// Run unit test code coverage report by running all tests in the test/unit directory
gulp.task('test-unit-code-coverage', ['test-unit-code-coverage-setup'], () => {
  return gulp.src('./test/unit/**/*.js', {
    read: false
  })
    .pipe(mocha())
    .pipe(istanbul.writeReports({
      reporters: [
        'text',
        'html',
        'lcov'
      ]
    }));
});


// Set up for code coverage to watch coverage of all files in the src directory
gulp.task('test-unit-code-coverage-setup', () => {
  return gulp.src(['./src/**/*.js'])
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});


// Watch files and run tests when a change is detected
gulp.task('watch', () => {
  // Run once to start
  runSequence('test-unit-code-coverage', 'lint', error => {
    // If any error happened in the previous tasks, exit with a code > 0
    if (error) {
      console.log('[ERROR] gulp test-unit-code-coverage task failed', error.message);
    }
  });

  // Watch to run again when there are any changes
  gulp.watch(['**/*', '!node_modules/**', '!reports/**'], () => {
    runSequence('test-unit-code-coverage', 'lint', error => {
      // If any error happened in the previous tasks, exit with a code > 0
      if (error) {
        console.log('[ERROR] gulp test-unit-code-coverage task failed', error.message);
      }
    });
  });
});

gulp.task('default', ['preCommit']);
