// @flow

let v1 = [1, 2, 3];
let v2 = [4, 5, 6];

let add = (acc:number, v:number) => acc + v ;
console.log('2 + v1: ', v1.map(i => i + 2));
console.log('2 * v1: ', v1.map(i => i * 2));
console.log('mean of v1: ', v1.reduce(add) / v1.length);
console.log('v1 dot v2: ', v1.map((v, i) => v * v2[i]).reduce(add));
console.log('sum of v1 + 2 * v2: ', v1.map((v, i) => v + 2 * v2[i]).reduce(add));
console.log('v1 as string: ', v1.map((v, i) => "v1[" + i + "] = " + v).reduce((acc:string, v:string) => acc + ", " + v));
/*
2 + v1: [ 3, 4, 5 ]
2 * v1: [ 2, 4, 6 ]
mean of v1: 2
v1 dot v2: 29 //DETTE SKAL VÆRE 32
sum of v1 + 2 * v2: 36
v1 as string: v1[0] = 1, v1[1] = 2, v1[2] = 3
*/
