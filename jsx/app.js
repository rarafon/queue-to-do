const React = require('react');
const ReactDom = require('react-dom');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      to_dos: [],
    };
  }
  onClick_create_todo = () => {
    var to_dos = [...this.state.to_dos];
    to_dos.push({name: "New To-Do"});
    this.setState({to_dos: to_dos,});
  };
  onClick_create_todo_item = () => {

  };
  render() {
    console.log(this.state);
    return (
      <div>
        <button type="button"
          onClick={this.onClick_create_todo}>Create To-Do</button>

        {this.state.to_dos.map((todo, index) => {
          return (
            <div key={index}>
              <input type="text" defaultValue={todo.name}></input>
              <button type="button" 
                onClick={this.onClick_create_todo_item}>+</button>
            </div>);
        })}
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById("main-container"));