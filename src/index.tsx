import * as React from "react";
import { render } from "react-dom";
import ReactTable from "react-table";

import logoRedHat from "./img/LogoRedHat.png";
import logoPhyster from "./img/logo.png";
import LogoOpenshift from "./img/LogoOpenShift.png";

import "react-table/react-table.css";
import "./styles.css";

type AppStateType = {
  name: string;
  comment: string;
  data: { name?: string; comment?: string; id?: number }[];
};

class App extends React.Component<{}, AppStateType> {
  constructor() {
    super({});

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadData = this.loadData.bind(this);

    this.state = {
      name: "",
      comment: "",
      data: []
    };
  }

  handleChange(event: any) {
    const name: "name" | "comment" = event.target.name;
    if (name == "name") {
      this.setState({ name: event.target.value });
    } else if (name == "comment") {
      this.setState({ comment: event.target.value });
    }
  }

  handleSubmit(event: any) {
    console.log("A name was submitted: ", this.state);

    fetch(`${process.env.REACT_APP_COMMENT_SERVICE_URL}/rest/comments`, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      method: "POST",
      body: JSON.stringify({
        id: this.state.data.length + 1,
        comment: this.state.comment,
        name: this.state.name
      })
    })
      .then(function(response) {
        return response.json();
      })
      .then(data => {
        this.setState({
          name: "",
          comment: ""
          // data: [
          //   ...this.state.data,
          //   {
          //     comment: this.state.comment,
          //     name: this.state.name,
          //     id: this.state.data.length + 1
          //   }
          // ]
        });
        this.loadData();
      });
    event.preventDefault();
  }

  loadData() {
    fetch(`${process.env.REACT_APP_COMMENT_SERVICE_URL}`, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    })
      .then(function(response) {
        return response.json();
      })
      .then(data => {
        console.log("get data", data);
        this.setState({ data: data || [] });
      });
  }

  componentWillMount() {
    this.loadData();
    // try {
    //   setInterval(async () => {
    //     this.loadData();
    //   }, 30000);
    // } catch (e) {
    //   console.log(e);
    // }
  }
  render() {
    const columns = [
      {
        Header: "ID",
        id: "id",
        accessor: (d: any) => (isNaN(d.id) ? d.id : Number(d.id))
      },
      {
        Header: "Název",
        accessor: "name"
      },
      {
        Header: "Komentář",
        accessor: "comment"
      }
    ];

    console.log(this.state);
    console.log("ENV", process.env);
    console.log(
      "VLADA'S ENV",
      `${process.env.REACT_APP_COMMENT_SERVICE_URL}/rest/comments`
    );
    return (
      <div className="App">
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "90px",
            top: "0"
          }}
        >
          <span style={{ position: "absolute", left: 0, top: "8px" }}>
            <img
              style={{ width: "80px", padding: "10px" }}
              src={LogoOpenshift}
              alt="redhat"
            />
          </span>
          <h1>OpenShift - metodika vývoje</h1>
          <h3>Pravidla pro vývoj nad platformou OpenShift pro společnost XY</h3>
        </div>
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "40px",
            top: "90px",
            display: "inline",
            left: 0
          }}
        >
          <form onSubmit={this.handleSubmit}>
            <span>Název</span>
            <input
              style={{ margin: "5px" }}
              type="text"
              value={this.state.name}
              name="name"
              onChange={this.handleChange}
            />
            <span>Komentář</span>
            <input
              style={{ margin: "5px" }}
              type="text"
              value={this.state.comment}
              name="comment"
              onChange={this.handleChange}
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div
          style={{
            position: "absolute",
            width: "(100% - 30px)",
            overflow: "auto",
            top: "130px",
            bottom: "60px",
            left: 0,
            right: 0,
            padding: "15px"
          }}
        >
          <div>
            <ReactTable
              data={this.state.data}
              columns={columns}
              showPagination={false}
              NoDataComponent={() => <span />}
              pageSize={this.state.data.length}
              defaultSorted={[
                {
                  id: "id",
                  desc: true
                }
              ]}
            />
          </div>
        </div>
        <div
          style={{
            position: "fixed",
            bottom: "50px",
            width: "100%",
            left: 0
          }}
        >
          <span style={{ position: "absolute", left: 25 }}>
            <img style={{ width: "140px" }} src={logoRedHat} alt="redhat" />
          </span>
          <span style={{ position: "absolute", right: 25 }}>
            <img style={{ width: "140px" }} src={logoPhyster} alt="physter" />
          </span>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
