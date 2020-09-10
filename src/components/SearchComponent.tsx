import React from 'react'
import { Dropdown, Message } from 'semantic-ui-react'

interface Props {
    onSubmit: (id: number, location: string) => void
    hiddenMessage: boolean
}
interface State {
    categories: { key: number, text: string, value: string, hidden: boolean }[];
    category_id: number;
    postcode: string;
    missingCategoryCheck: boolean;
};

export default class SearchComponent extends React.Component<Props, State> {
    state: State = {
        categories: [],
        category_id: -1,
        postcode: "",
        missingCategoryCheck: true
    };

    onFormSubmit = (event: any): void => {
        event.preventDefault()
        if (this.state.category_id === -1 || !Number.isInteger(this.state.category_id)) {
            this.setState((current) => ({ ...current, missingCategoryCheck: false }))
        } else {
            this.setState((current) => ({ ...current, missingCategoryCheck: true }))
            this.props.onSubmit(this.state.category_id, this.state.postcode)
        }

    };

    async componentDidMount() {
        let categoryList: { key: number, text: string, value: string, hidden: boolean }[] = [];
        await fetch('https://d1i9eedhsgvpdh.cloudfront.net/production-plentific-static/api-cache/find-a-pro/api/v1/categories/all.json')
            .then(response => response.json())
            .then(data => {
                data.map(function (category: any, index: number): any {
                    if (category.hidden === false)
                        categoryList.push({ key: index, text: category.name, value: category.id, hidden: category.hidden })
                    return categoryList
                });
                this.setState((current) => ({ ...current, categories: categoryList }))
            })
            .catch((err) => {
                console.log("Error fetching data", err);
            });
    }

    render() {

        return (
            <div className="ui form"  >
                <form onSubmit={this.onFormSubmit} >
                    <div className="fields">
                        <div className="seven wide field">
                            <label>Category</label>
                            <Dropdown
                                style={{ flex: 4 }}
                                placeholder='Please Select a Category'
                                fluid
                                clearable
                                search
                                selection
                                required
                                onChange={(e, data) => this.setState({ category_id: data.value as number })}
                                options={this.state.categories}
                            /></div>
                        <div className="seven wide field">
                            <label style={{ marginLeft: 10 }} htmlFor="input"> Postcode</label>
                            <input
                                id="input"
                                style={{ flex: 3, marginLeft: 10, marginRight: 10 }}
                                type="text"
                                placeholder="Enter an outward code"
                                maxLength={4}
                                value={this.state.postcode.toLowerCase()}
                                onChange={e => this.setState({ postcode: e.target.value })}
                            />
                        </div>
                        <div className="one wide field">
                            <button style={{ marginTop: 23 }} className="ui inverted green button">Submit</button>
                        </div>

                    </div>

                </form>
                <Message negative hidden={this.props.hiddenMessage}>
                    <Message.Header>Please enter a valid outward code.</Message.Header>
                </Message>
                <Message negative hidden={this.state.missingCategoryCheck}>
                    <Message.Header>Please select a category</Message.Header>
                </Message>
            </div>
        );
    }
}
