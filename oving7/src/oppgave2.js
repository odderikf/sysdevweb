// @flow

class Complex {
  real: number;
  imag: number;

  constructor(real: number, img: number) {
    this.real = real;
    this.imag = img;
  }
}

let v = [new Complex(2, 2), new Complex(1, 1)];

console.log('v elements as strings: ', v.map( (e,i)=>e.real+' + '+e.imag+"i" ));
console.log('magnitude of v elements: ', v.map( (e,i)=>Math.sqrt( Math.pow(e.real, 2)+Math.pow(e.imag,2) ) ));
console.log('sum of v: ', v.reduce( (acc,e) => (new Complex(acc.real+e.real, acc.imag+e.imag)) ));

/*
v elements as strings: [ '2 + 2i', '1 + 1i' ]
magnitude of v elements: [ 2.8284271247461903, 1.7320508075688772 ]
sum of v: Complex { real: 3, imag: 3 }
*/
