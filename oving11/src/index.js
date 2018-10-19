// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component , sharedComponentData } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {Alert, Button, Card, Navbar, ListGroup, Form} from './widgets';
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

let shared = sharedComponentData(
  { students : [
    new Student('Ola', 'Jensen', 'ola.jensen@ntnu.no'),
    new Student('Kari', 'Larsen', 'kari.larsen@ntnu.no'),
    new Student('Odd', 'Geir', 'odd.geir@ntnu.no'),
    new Student('Karl', 'Karlsen', 'karl.karlsen@ntnu.no'),
    new Student('Olly', 'Arnesen', 'olly.arnesen@ntnu.no'),
    new Student('Trixis', '4Kids', 'trixis.4kids@ntnu.no')
    ],
    subjects : [],
    AlertBar: null
  });

  Array.prototype.push.apply(shared.subjects, [
    new Subject('Systemutvikling 2 med web applikasjoner', 'TDAT2003', shared.students.slice(0, 2)),
    new Subject('Japansk 1', 'JAP0501', shared.students.slice(2, 4)),
    new Subject('Applikasjonsutvikling for Android', 'IINI4001', shared.students.slice(0, 3)),
    new Subject('Realfag for dataingeniører', 'TDAT2001', shared.students.slice(0)),
    new Subject('Algoritmer og datastrukturer ', 'TDAT2005', shared.students.slice(3))
  ]);

class Menu extends Component {
  render() {
    return (
      <Navbar>
        <NavLink style={{color: "white"}} activeStyle={{ color: 'cyan' }} exact to="/">
          React example
        </NavLink>
        <NavLink style={{color: "white"}} activeStyle={{ color: 'cyan' }} to="/students">
          Students
        </NavLink>
        <NavLink style={{color: "white"}} activeStyle={{ color: 'cyan' }} to={'/subjects'}>
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
    students: shared.students,
    addbutton: true
  };

  render() {
    return (
      <ListGroup>
        {this.props.students.map(student => (
          <ListGroup.Item key={student.email}>
            <NavLink activeStyle={{ color: 'darkblue' }} to={'/students/' + student.email}>
              {student.firstName} {student.lastName}
            </NavLink>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }
}

class Students extends Component{
  render() {
    return (
      <>
        <StudentList/>
        <Button value="add new student" onClick={e=>this.addStudent()} />
      </>
    )
  }
  addStudent() {
    this.props.history.push("/addstudent")
  }
}
class SubjectList extends Component {
  static defaultProps = {
    subjects: shared.subjects
  };

  render() {
    return (
      <ListGroup>
        {this.props.subjects.map(subject => (
          <ListGroup.Item key={subject.code}>
            <NavLink activeStyle={{ color: 'darkblue' }} to={'/subjects/' + subject.code}>
              {subject.code} {subject.title}
            </NavLink>
          </ListGroup.Item>
        ))}
      </ListGroup>
    )
  }
}

class Subjects extends Component {
  render() {
    return (
      <>
      <SubjectList/>
      <Button value="add new subject" onClick={e=>this.addSubject()} />
      </>
    )
  }
  addSubject() {
    this.props.history.push("/addsubject")
  }
}
class StudentDetails extends Component<{ match: { params: { email: string } } }> {

  deleteStudent(student: Student) {
    let i = shared.students.findIndex(v => v.email === student.email);
    shared.students.splice(i, 1);
    shared.subjects.forEach(sub => {
      let j = sub.students.findIndex(w => w.email === student.email);
      sub.students.splice(j, 1);
    });
    this.props.history.goBack();
  }

  editStudent(student: Student) {
    this.props.history.push("/students/"+student.email+"/edit");
  }

  render() {
    let student = shared.students.find(student => student.email === this.props.match.params.email);
    if (!student) {
      console.error('Student not found'); // Until we have a warning/error system (next week)
      return null; // Return empty object (nothing to render)
    }
    return (
      <div>
        <Card title={student.firstName+" "+student.lastName}>
          <p>Subjects:</p>
          <SubjectList subjects={shared.subjects.filter(subject => (subject.students.includes(student)))}/>
          <Button value="edit" onClick={e=>this.editStudent(student)}/>
          <Button.Danger value="DELETE" onClick={e=>this.deleteStudent(student)}/>
        </Card>
        <input />
      </div>
    );
  }
}

class StudentEdit extends Component<{ match: { params: { email: string } } }> {

  constructor(props){
    super(props);
    let student = shared.students.find(s => s.email === this.props.match.params.email);
    this.state = {
      firstName: student.firstName,
      lastName: student.lastName
    };
  }
  handleSubmit(){
    let student = shared.students.find(s => s.email === this.props.match.params.email);
    if (!student){
      shared.AlertBar.current.Danger("Student not found, possibly deleted by other user.");
      return;
    }
    if (this.state.firstName.length < 3){
      shared.AlertBar.current.Warning("First name too short");
      return;
    }
    if (this.state.lastName.length < 3){
      shared.AlertBar.current.Warning("Last name too short");
      return;
    }
    student.firstName = this.state.firstName;
    student.lastName = this.state.lastName;
    this.props.history.push("/students/"+student.email);
    shared.AlertBar.current.Success("Successfully edited student");
  }
  changeFName(v){
    this.setState({firstName: v});
  }

  changeLName(v){
    this.setState({lastName: v});
  }
  render() {
    let student = shared.students.find(student => student.email === this.props.match.params.email);
    if (!student) {
      console.error('Student not found'); // Until we have a warning/error system (next week)
      return null; // Return empty object (nothing to render)
    }
    return (
      <form onSubmit={()=>this.handleSubmit()}>
        <Form.Entry>
          <Form.Label htmlFor="firstname">First name:</Form.Label>
          <Form.Input type="text" id="firstname" autoComplete="firstname" value={this.state.firstName} onChange={e=>this.changeFName(e.target.value)}/>
        </Form.Entry>
        <Form.Entry>
          <Form.Label htmlFor="lastname">Last name:</Form.Label>
          <Form.Input type="text" id="lastname" autoComplete="family-name" value={this.state.lastName} onChange={e=>this.changeLName(e.target.value)}/>
        </Form.Entry>
        <Form.Submitter/>
      </form>
    );
  }
}

class StudentAdd extends Component{
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: ""
    };
  }

  handleSubmit(){
    if (this.state.firstName.length < 3){
      shared.AlertBar.current.Warning("First name too short");
      return;
    }
    if (this.state.lastName.length < 3){
      shared.AlertBar.current.Warning("Last name too short");
      return;
    }
    if (shared.students.find(s => s.email === this.state.email)) {
      shared.AlertBar.current.Danger("Email already taken");
      return;
    }

    let student = new Student(this.state.firstName, this.state.lastName, this.state.email);
    shared.students.push(student);
    this.props.history.push("/students/"+student.email);
    shared.AlertBar.current.Success("Successfully added student");
  }
  changeFName(v){
    this.setState({firstName: v});
  }

  changeLName(v){
    this.setState({lastName: v});
  }
  changeEmail(v){
    this.setState({email: v});
  }

  render() {
    return (
      <form onSubmit={()=>this.handleSubmit()}>
        <Form.Entry>
          <Form.Label htmlFor="firstname">First name:</Form.Label>
          <Form.Input type="text" id="firstname" autoComplete="firstname" value={this.state.firstName} onChange={e=>this.changeFName(e.target.value)}/>
        </Form.Entry>
        <Form.Entry>
          <Form.Label htmlFor="lastname">Last name:</Form.Label>
          <Form.Input type="text" id="lastname" autoComplete="family-name" value={this.state.lastName} onChange={e=>this.changeLName(e.target.value)}/>
        </Form.Entry>
        <Form.Entry>
          <Form.Label htmlFor="email">Last name:</Form.Label>
          <Form.Input type="text" id="email" autoComplete="email" value={this.state.email} onChange={e=>this.changeEmail(e.target.value)}/>
        </Form.Entry>

        <Form.Submitter/>
      </form>
    );
  }

}

class SubjectEdit extends Component<{ match: { params: { code: string } } }> {

  constructor(props) {
    super(props);

    let subject = shared.subjects.find(s => s.code === this.props.match.params.code);
    let isIncl = {};
    subject.students.forEach(s => isIncl[s.email] = true);
    this.state = {
      title: subject.title,
      students: subject.students,
      isIncl: isIncl,
      email: "",
    };

  }

  handleSubmit(e){
    e.preventDefault();
    if ( this.state.title.length <= 3){
      shared.AlertBar.current.Warning("Title too short");
      return;
    }
    let subject = shared.subjects.find(s => s.code === this.props.match.params.code);
    subject.title = this.state.title;
    subject.students = this.state.students.filter( s => this.state.isIncl[s.email] );
    this.props.history.push("/subjects/"+subject.code);
  }

  handleStudentSubmit(e) {
    e.preventDefault();
    let s = shared.students.find(s => s.email === this.state.email);
    if (!s) {
      shared.AlertBar.current.Warning("Student not found, is the email correct?");
      return
    }
    if (this.state.students.includes(s)){
      shared.AlertBar.current.Warning("Student is already registered");
      return;
    }

    let students = this.state.students;
    students.push(s);
    let isIncl = this.state.isIncl;
    isIncl[s.email] = true;
    this.setState({students: students, isIncl: isIncl});

  }

  changeTitle(v){
    this.setState({title: v});
  }

  changeStudent(t){
    let student = this.state.students.find(s=> s.email === t.id);
    let isIncl = this.state.isIncl;
    isIncl[student.email] = t.checked;
    this.setState({isIncl: isIncl});
  }

  changeEmail(v){
    this.setState({email: v});
  }
  render() {

    return (
      <div className="two-column">
        <div className="two-column-left-dominant">
          <form onSubmit={(e)=>this.handleSubmit(e)} >
            <Form.Entry>
              <Form.Label htmlFor="title">Title:</Form.Label>
              <Form.Input type="text" id="title" autoComplete="title" value={this.state.title} onChange={e=>this.changeTitle(e.target.value)}/>
            </Form.Entry>
            <div id="studentcheckboxes">
              {(this.state.students.map(s => (
              <Form.Entry>
                <Form.Label htmlFor={s.email}>{s.email}</Form.Label>
                <Form.Input type="checkbox" id={s.email} checked={this.state.isIncl[s.email]} onChange={e=>this.changeStudent(e.target)}/>
              </Form.Entry>
              )))}
            </div>
            <br/>
            <Form.Submitter/>
          </form>
        </div>
        <div className="two-column-right">
          <form onSubmit={(e)=>this.handleStudentSubmit(e)}>
            <Form.Entry>
              <Form.Label htmlFor="email">Add student by email: </Form.Label>
              <Form.Input type="text" id="email" value={this.state.email} onChange={e=>this.changeEmail(e.target.value)}/>
            </Form.Entry>
            <Form.Submitter>Add student</Form.Submitter>
          </form>
        </div>
      </div>
    );
  }
}

class SubjectAdd extends Component{

  constructor(props) {
    super(props);

    this.state = {
      title: "",
      students: [],
      isIncl: {},
      email: "",
    };

  }

  handleSubmit(e){
    e.preventDefault();
    if ( this.state.title.length <= 3){
      shared.AlertBar.current.Warning("Title too short");
      return;
    }
    if ( this.state.code.length <= 5){
      shared.AlertBar.current.Warning("Code too short");
      return
    }
    if ( shared.subjects.find( s => s.code === this.state.code ) ){
      shared.AlertBar.current.Danger("Code already taken");
    }
    let students = this.state.students.filter(s => this.state.isIncl[s.email] );
    let subject = new Subject(this.state.title, this.state.code, students);
    shared.subjects.push(subject);
    this.props.history.push("/subjects/"+subject.code);
  }

  handleStudentSubmit(e) {
    e.preventDefault();
    let s = shared.students.find(s => s.email === this.state.email);
    if (!s) {
      shared.AlertBar.current.Warning("Student not found, is the email correct?");
      return
    }
    if (this.state.students.includes(s)){
      shared.AlertBar.current.Warning("Student is already registered");
      return;
    }

    let students = this.state.students;
    students.push(s);
    let isIncl = this.state.isIncl;
    isIncl[s.email] = true;
    this.setState({students: students, isIncl: isIncl});

  }

  changeTitle(v){
    this.setState({title: v});
  }

  changeStudent(t){
    let student = this.state.students.find(s=> s.email === t.id);
    let isIncl = this.state.isIncl;
    isIncl[student.email] = t.checked;
    this.setState({isIncl: isIncl});
  }

  changeCode(v){
    this.setState({code: v});
  }

  changeEmail(v){
    this.setState({email: v});
  }

  render() {

    return (
      <div className="two-column">
        <div className="two-column-left-dominant">
          <form onSubmit={(e)=>this.handleSubmit(e)} >
            <Form.Entry>
              <Form.Label htmlFor="title">Title:</Form.Label>
              <Form.Input type="text" id="title" autoComplete="title" value={this.state.title} onChange={e=>this.changeTitle(e.target.value)}/>
            </Form.Entry>
            <Form.Entry>
              <Form.Label htmlFor="code">Code:</Form.Label>
              <Form.Input type="text" id="code" autoComplete="code" value={this.state.code} onChange={e=>this.changeCode(e.target.value)}/>
            </Form.Entry>
            <div id="studentcheckboxes">
              {(this.state.students.map(s => (
                <Form.Entry>
                  <Form.Label htmlFor={s.email}>{s.email}</Form.Label>
                  <Form.Input type="checkbox" id={s.email} checked={this.state.isIncl[s.email]} onChange={e=>this.changeStudent(e.target)}/>
                </Form.Entry>
              )))}
            </div>
            <br/>
            <Form.Submitter/>
          </form>
        </div>
        <div className="two-column-right">
          <form onSubmit={(e)=>this.handleStudentSubmit(e)}>
            <Form.Entry>
              <Form.Label htmlFor="email">Add student by email: </Form.Label>
              <Form.Input type="text" id="email" value={this.state.email} onChange={e=>this.changeEmail(e.target.value)}/>
            </Form.Entry>
            <Form.Submitter>Add student</Form.Submitter>
          </form>
        </div>
      </div>
    );
  }
}

class SubjectDetails extends Component<{ match: { params: { code: string } } }> {

  deleteSubject(subject: Subject) {
    let i = shared.subjects.findIndex(v => v.code === subject.code);
    shared.subjects.splice(i, 1);
    this.props.history.goBack();
  }

  editSubject(subject: Subject) {
    this.props.history.push("/editsubjects/"+subject.code);
  }

  render() {
    let subject = shared.subjects.find(subject => subject.code === this.props.match.params.code);
    if (!subject) {
      console.error('subject not found');
      return null;
    }
    return (
      <div>
        <Card title={subject.title} subtitle={subject.code}>
          <p>Students:</p>
          <StudentList students={subject.students}/>
          <Button value="edit" onClick={()=>this.editSubject(subject)} />
          <Button.Danger value="delete" onClick={()=>this.deleteSubject(subject)}/>
        </Card>
      </div>
    );
  }
}

const root = document.getElementById('root');
if (root) {
  let alert = React.createRef();
  ReactDOM.render(
    <HashRouter>
      <div>
        <div id="fixed_top">
          <Alert ref={alert}/>
        </div>
        <div style={{height: "10vh", "background-color": "grey"}}/>
        <Menu id="menu"/>
        <Route exact path="/" component={Home}/>
        <Route path="/students" component={Students}/>
        <Route path="/students/:email" component={StudentDetails}/>
        <Route path="/subjects" component={Subjects}/>
        <Route path="/subjects/:code" component={SubjectDetails}/>
        <Route path="/editstudents/:email" component={StudentEdit}/>
        <Route path="/editsubjects/:code" component={SubjectEdit}/>
        <Route path="/addstudent" component={StudentAdd}/>
        <Route path="/addsubject" component={SubjectAdd}/>
      </div>
    </HashRouter>,
    root
  );
  shared.AlertBar = alert;
  console.log(shared);
}
