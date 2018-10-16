// @flow

let students = [{
  name: 'Ola',
  grade: 'A'
}, {
  name: 'Kari',
  grade: 'C'
}, {
  name: 'Knut',
  grade: 'C'
}];


console.log("students elements as strings: ", students.map((e, i) => e.name + " got " + e.grade))
console.log("How many got C: ", students.filter(e => e.grade === "C").length)
console.log("Percentage of C grades: ", students.filter(e => e.grade === "C").length / students.length)
console.log("Did anyone get A: ", students.some(e => e.grade === "A"))
console.log("Did anyone get F: ", students.some(e => e.grade === "F"))
/*
students elements as strings: [ 'Ola got A', 'Kari got C', 'Knut got C' ]
How many got C: 2
Percentage of C grades: 0.6666666666666666
Did anyone get A: Yes
Did anyone get F: No
*/
