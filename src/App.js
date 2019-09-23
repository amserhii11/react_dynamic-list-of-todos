import React from 'react';
import './App.css';
import ToDoList from './Components/ToDoList/ToDoList';
import { getTodos } from './api/getTodos';
import { getUsers } from './api/getUsers';

function getTodosWithUsers(todoArr, userArr) {
  return todoArr.map(todo => ({
    ...todo,
    user: userArr.find(item => item.id === todo.userId),
  }));
}

class App extends React.Component {
  state = {
    todos: [],
    users: [],
    isLoading: false,
    hasError: false,
  };

  sortByUser = () => {
    this.setState(prevState => ({
      todos: prevState.todos.sort((a, b) => (a.user > b.user ? 1 : -1)),
    }));
  };

  sortByTitle = () => {
    this.setState(prevState => ({
      todos: prevState.todos.sort((a, b) => (a.title > b.title ? 1 : -1)),
    }));
  };

  sortByStatus = () => {
    this.setState(prevState => ({
      todos: prevState.todos.sort((a, b) => (a.completed < b.completed ? 1 : -1)),
    }));
  };

  dataLoading = () => {
    this.setState({
      isLoading: true,
      hasError: false,
    });

    getTodos()
      .then((todos) => {
        this.setState({ todos });
      })
      .catch(() => this.setState({
        hasError: true,
        isLoading: false,
      }));

    getUsers()
      .then((users) => {
        this.setState({ users, isLoading: false });
      })
      .catch(() => this.setState({
        hasError: true,
        isLoading: false,
      }));
  };

  render() {
    const preparedTodos = getTodosWithUsers(this.state.todos, this.state.users);
    return (
      <div className="App">
        <h1>Dynamic list of todos</h1>
        {this.state.hasError && (
          <>
            <h3>Errors occurred</h3>
            <button
              type="button"
              onClick={this.dataLoading}
              className="btn btn-info"
            >
              {this.state.isLoading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <span>Try again</span>
              )}
              {' '}
            </button>
          </>
        )}
        {this.state.todos.length === 0 ? (
          <button
            type="button"
            onClick={this.dataLoading}
            className="btn btn-info"
          >
            {this.state.isLoading ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              <span>Load</span>
            )}
            {' '}
          </button>
        ) : (
          <ToDoList
            todos={preparedTodos}
            sortByTitle={this.sortByTitle}
            sortByUser={this.sortByUser}
            sortByStatus={this.sortByStatus}
          />
        )}
      </div>
    );
  }
}

export default App;
