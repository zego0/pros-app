import React from 'react';
import '../styles/App.css';
import axios from 'axios';
import pros from '../images/pros.png';
import { Pagination } from 'semantic-ui-react'
import SearchComponent from './SearchComponent'
import TableComponent from './TableComponent'

interface Props {
}
interface State {
  category_id: number,
  location: string,
  pros: { id: number, name: string, postcode: string, rating: number }[],
  totalPage: number
  offset: number
  hiddenMessage: boolean
  hiddenTable: boolean
};

export default class App extends React.Component<Props, State> {
  state: State = {
    category_id: -1,
    location: "",
    pros: [],
    offset: 0,
    totalPage: 1,
    hiddenMessage: true,
    hiddenTable: true
  };

  async onSearchSubmit(id: number, location: string) {
    let proList: { id: number, name: string, postcode: string, rating: number }[] = [];
    const options = {
      headers: {
        "Content-Type": "application/json",
        "x-pagination-offset": `${this.state.offset}`,
        "x-pagination-limit": "20"
      }
    };
    await axios.post('https://demo.plentific.com/find-a-pro/api/v2/public/pro/search-pros/',
      { category_id: id, location: location }, options)
      .then(response => {
        response.data.response.pros.map(function (pro: any): any {
          proList.push({
            id: pro.id,
            name: pro.name,
            postcode: pro.main_address.postcode,
            rating: pro.review_rating
          })
          return proList
        });
        this.setState((current) => ({
          ...current, pros: proList,
          totalPage: Math.floor(response.headers["x-pagination-count"] / 20),
          category_id: id,
          location: location,
          hiddenMessage: true,
          hiddenTable: false,
        }))
      }
      )
      .catch(error => {
        this.setState((current) => ({ ...current, hiddenMessage: false }))
      });
  }
  handlePaginationChange = async (e: any, { activePage }: any) => {
    let page: number = activePage * 20
    await this.setState({ offset: page })
    this.onSearchSubmit(this.state.category_id, this.state.location)
  }

  render() {
    return (
      <div className="layout">
        <img src={pros} className="logo" alt="logo" />
          <hr></hr>
          <SearchComponent
            hiddenMessage={this.state.hiddenMessage}
            onSubmit={this.onSearchSubmit.bind(this)}>
          </SearchComponent>
          <hr></hr>
          <TableComponent hiddenTable={this.state.hiddenTable} pros={this.state.pros}></TableComponent>
          <br></br>
          <Pagination
            hidden={this.state.hiddenTable}
            defaultActivePage={1}
            totalPages={this.state.totalPage}
            onPageChange={this.handlePaginationChange}
          />
      </div>
    );
  }
}
