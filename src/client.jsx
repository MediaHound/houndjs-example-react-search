import React from 'react';
import { render } from 'react-dom';
import Autosuggest from 'react-autosuggest';
import { MHSearch, MHSDK } from 'houndjs';

class Search extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };
  }

  onSuggestionsUpdateRequested = ({ value }) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length > 0) {
      MHSearch
        .fetchResultsForSearchTerm(trimmedValue, [MHSearch.SCOPE_MOVIE])
        .then(response => {
          const results = response.content.map(pair => pair.object);

          if (this.state.value === value) {
            this.setState({
              suggestions: results
            });
          }
        });
    }
    else {
      this.setState({
        suggestions: []
      })
    }
  };

  getSuggestionValue = (suggestion) => {
    return suggestion.metadata.name;
  };

  renderSuggestion = (suggestion) => {
    let year;
    if (suggestion.metadata.releaseDate) {
      year = (
        <div className="searchResult-contributions">
          {suggestion.metadata.releaseDate.getUTCFullYear()}
        </div>
      );
    }
    return (
      <a className="searchResult-link">
        <img src={suggestion.primaryImage.metadata.thumbnail.url}
            alt={suggestion.metadata.name}
            className="searchResult-image" />

        <div className="searchResult-text">
          <div className="searchResult-name">
            {suggestion.metadata.name}
          </div>
          {year}
        </div>
      </a>
    );
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    console.log('Movie selected:', suggestion);
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      value,
      onChange: this.onChange, 
      placeholder: 'Search for a movie'
    };

    return (
      <Autosuggest suggestions={suggestions}
                   onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                   onSuggestionSelected={this.onSuggestionSelected}
                   getSuggestionValue={this.getSuggestionValue}
                   renderSuggestion={this.renderSuggestion}
                   inputProps={inputProps} />
    );
  }
}

MHSDK.configure('mhclt_houndjs-example-react-search', 'TEyL0eFeCA3V0f3kZDHOe0VsWE5q2N0byzJxgYma3wVK1o12')
  .then(() => {
    render(<Search />, document.getElementById('root'));
  });
