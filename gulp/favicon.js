import colors from 'ansi-colors';
import fancyLog from 'fancy-log';
import fs from 'fs';
import gulp from 'gulp';
import realFavicon from 'gulp-real-favicon';

const faviconDataFile = 'faviconData.json';
const faviconPath = '../assets/images/icon.png';
const buildDir = '../build';
const imgDest = `../dist`;

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
async function generateFavicon() {
  realFavicon.generateFavicon(
    {
      masterPicture: faviconPath,
      dest: imgDest,
      iconsPath: '/',
      design: {
        ios: {
          pictureAspect: 'noChange',
          assets: {
            ios6AndPriorIcons: false,
            ios7AndLaterIcons: false,
            precomposedIcons: false,
            declareOnlyDefaultIcon: true,
          },
        },
        desktopBrowser: {
          design: 'background',
          backgroundColor: '#ffffff',
          backgroundRadius: 1,
          imageScale: 1,
        },
        windows: {
          pictureAspect: 'noChange',
          backgroundColor: '#da532c',
          onConflict: 'override',
          assets: {
            windows80Ie10Tile: false,
            windows10Ie11EdgeTiles: {
              small: false,
              medium: true,
              big: false,
              rectangle: false,
            },
          },
        },
        androidChrome: {
          pictureAspect: 'noChange',
          themeColor: '#ffffff',
          manifest: {
            display: 'standalone',
            orientation: 'notSet',
            onConflict: 'override',
            declared: true,
          },
          assets: {
            legacyIcon: false,
            lowResolutionIcons: false,
          },
        },
        safariPinnedTab: {
          pictureAspect: 'silhouette',
          themeColor: '#5bbad5',
        },
      },
      settings: {
        scalingAlgorithm: 'Mitchell',
        errorOnImageTooSmall: false,
        readmeFile: false,
        htmlCodeFile: false,
        usePathAsIs: false,
      },
      markupFile: faviconDataFile,
    },
    function () {
      fancyLog(colors.green('Favicon files successfully generated'));
    },
  );
  await Promise.resolve();
}

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
function injectFaviconMarkups() {
  return gulp
    .src(['../src/*.html'], { since: gulp.lastRun(injectFaviconMarkups) })
    .pipe(
      realFavicon.injectFaviconMarkups(
        // @ts-ignore
        JSON.parse(fs.readFileSync(faviconDataFile)).favicon.html_code,
      ),
    )
    .pipe(gulp.dest(buildDir));
}

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
async function checkFaviconUpdate() {
  // @ts-ignore
  var currentVersion = JSON.parse(fs.readFileSync(faviconDataFile)).version;
  realFavicon.checkForUpdates(currentVersion, function (err) {
    if (err) {
      throw err;
    }
  });
  await Promise.resolve();
}

export { checkFaviconUpdate, generateFavicon, injectFaviconMarkups };
