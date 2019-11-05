// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    config: {
      apiKey: 'AIzaSyBgPT51lOzkH0Lwb63r0s4iQoyKgn2VuSY',
      authDomain: 'mobihymn.firebaseapp.com',
      databaseURL: 'https://mobihymn.firebaseio.com',
      projectId: 'mobihymn',
      storageBucket: 'mobihymn.appspot.com',
      messagingSenderId: '525477034225'
    },
    email: 'tim.gandionco@gmail.com',
    password: 'Tjvg1991'
  },
  keys: {
    major: [
      { name: 'C', otherNames: ['C Major'] },
      { name: 'C#/Db', otherNames: ['C# Major', 'Db Major'] },
      { name: 'D', otherNames: ['D Major'] },
      { name: 'D#/Eb', otherNames: ['D# Major', 'Eb Major'] },
      { name: 'E', otherNames: ['E Major'] },
      { name: 'F', otherNames: ['F Major'] },
      { name: 'F#/Gb', otherNames: ['F# Major', 'Gb Major'] },
      { name: 'G', otherNames: ['G Major'] },
      { name: 'G#/Ab', otherNames: ['G# Major', 'Ab Major'] },
      { name: 'A', otherNames: ['A Major'] },
      { name: 'A#/Bb', otherNames: ['A# Major', 'Bb Major'] },
      { name: 'B', otherNames: ['B Major'] }
    ],
    minor: [
      { name: 'Cm', otherNames: ['C Minor'] },
      { name: 'C#m/Dbm', otherNames: ['C# Minor', 'Db Minor'] },
      { name: 'Dm', otherNames: ['D Minor'] },
      { name: 'D#m/Ebm', otherNames: ['D# Minor', 'Eb Minor'] },
      { name: 'Em', otherNames: ['E Minor'] },
      { name: 'Fm', otherNames: ['F Minor'] },
      { name: 'F#m/Gbm', otherNames: ['F# Minor', 'Gb Minor'] },
      { name: 'Gm', otherNames: ['G Minor'] },
      { name: 'G#m/Abm', otherNames: ['G# Minor', 'Ab Minor'] },
      { name: 'Am', otherNames: ['A Minor'] },
      { name: 'A#m/Bbm', otherNames: ['A# Minor', 'Bb Minor'] },
      { name: 'Bm', otherNames: ['B Minor'] }
    ]
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
