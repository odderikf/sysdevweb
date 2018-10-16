// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';

class Student {
  firstName: string;
  lastName: string;
  email: string;

  constructor(firstName: string, lastName: string, email: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}

let students = [
  new Student('Ola', 'Jensen', 'ola.jensen@ntnu.no'),
  new Student('Kari', 'Larsen', 'kari.larsen@ntnu.no'),
  new Student('Odd', 'Geir', 'odd.geir@ntnu.no'),
  new Student('Karl', 'Karlsen', 'karl.karlsen@ntnu.no'),
  new Student('Olly', 'Arnesen', 'olly.arnesen@ntnu.no'),
  new Student('Trixis', '4Kids', 'trixis.4kids@ntnu.no')
];

class Subject {
  title: string;
  code: string;
  students: Array<Student>;

  constructor(title: string, code: string, students: Array<Student>) {
    this.title = title;
    this.code = code;
    this.students = students;
  }
}

let subjects = [
  new Subject("Systemutvikling 2 med web applikasjoner", "TDAT2003", students.slice(0,2)),
  new Subject("Japansk 1", "JAP0501", students.slice(2,4)),
  new Subject("Applikasjonsutvikling for Android", "IINI4001", students.slice(0,3)),
  new Subject("Realfag for dataingeniører", "TDAT2001", students),
  new Subject("Algoritmer og datastrukturer ", "TDAT2005", students.slice(3))
];

class Card extends Component {
  static defaultProps = {
    title: "title",
    subtitle: ""
  };

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{this.props.title}</h5>
          <h6 className="card-subtitle">{this.props.subtitle}</h6>
          {this.props.children}
        </div>
      </div>
    )
  }
}

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
          {this.props.children.map( child =>
            <li className="nav-item active">
              <div className="nav-link">{child}</div>
            </li>
          )}
          </ul>
        </div>
      </nav>
    )
  }
}

class ListGroup extends Component {
  render() {
    return (
      <ul className="list-group">
        {this.props.children}
      </ul>
    )
  }
}

class ListGroupItem extends Component {
  render () {
    return (
      <li className="list-group-item" {...this.props}>
        {this.props.children}
      </li>
    )
  }
}

class Menu extends Component {
  render(){
    return (
      <Navbar>
        <NavLink activeStyle={{ color: 'darkblue' }} exact to="/">
          React example
        </NavLink>
        <NavLink activeStyle={{ color: 'darkblue' }} to="/students">
          Students
        </NavLink>
        <NavLink activeStyle={{ color: 'darkblue' }} to={"/subjects"}>
          Subjects
        </NavLink>
      </Navbar>
    );
  }
}

class Home extends Component {
  render() {
    return <div>React example with static pages</div>;
  }
}

class StudentList extends Component {
  static defaultProps = {
    students: students
  };

  render() {
    return (
      <ListGroup>
        {this.props.students.map(student => (
          <ListGroupItem key={student.email}>
            <NavLink activeStyle={{ color: 'darkblue' }} to={'/students/' + student.email}>
              {student.firstName} {student.lastName}
            </NavLink>
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }
}

class SubjectList extends Component {
  static defaultProps = {
    subjects: subjects
  };

  render() {
    return (
      <ListGroup>
        {this.props.subjects.map(subject => (
          <ListGroupItem key={subject.code}>
            <NavLink activeStyle={{ color: 'darkblue' }} to={'/subjects/' + subject.code}>
              {subject.code} {subject.title}
            </NavLink>
          </ListGroupItem>
        ))}
      </ListGroup>
    )
  }
}

class StudentDetails extends Component<{ match: { params: { email: string } } }> {
  render() {
    let student = students.find(student => student.email === this.props.match.params.email);
    if (!student) {
      console.error('Student not found'); // Until we have a warning/error system (next week)
      return null; // Return empty object (nothing to render)
    }
    return (
      <div>
        <Card title={student.lastName+", "+student.firstName}>
          <p>Subjects:</p>
          <SubjectList subjects={subjects.filter( subject => (subject.students.includes(student)) )}/>
        </Card>
      </div>
    );
  }
}

class SubjectDetails extends Component<{ match: { params: { code: string } } }> {
  render() {
    let subject = subjects.find(subject => subject.code === this.props.match.params.code);
    if (!subject) {
      console.error('subject not found');
      return null;
    }
    return (
      <div>
        <Card title={subject.title} subtitle={subject.code}>
          <p>Students:</p>
          <StudentList students={subject.students}/>
        </Card>
      </div>
    );
  }
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(
    <HashRouter>
      <div>
        <Menu/>
        <Route exact path="/" component={Home}/>
        <Route path="/students" component={StudentList }/>
        <Route path="/students/:email" component={StudentDetails}/>
        <Route path="/subjects" component={SubjectList}/>
        <Route path="/subjects/:code" component={SubjectDetails}/>
      </div>
    </HashRouter>,
    root
  );
}
