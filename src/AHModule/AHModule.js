// @flow
import React, { Children } from "react";
import { withTheme, AHThemeType } from "../AHTheme/AHTheme";
import { AHTitle } from "../AHTitle/AHTitle";
import { AHButton } from "../AHButton/AHButton";
import Color from "color";
import styled, { css } from "styled-components";

/*
AHModule an be used in two ways

With render method or with children.

With Render method:
<AHModule loading={false} render={() => <p>Test</p>}/>

The render method will only be called when loading is true.
This is useful if the module is used with data fetching.

With children:
<AHModule>
  <p>Test</p>
</AHModule>
The children will be created by the parent and thus exist even if loading is true.
This can be used when no data fetching is needed.

*/

type Props = {
  theme: AHThemeType,
  render?: () => Element<any>,
  children: Children,
  style?: Object,
  onClick?: (e: Event) => void,
  loading?: boolean,
  error?: boolean,
  print?: boolean
};

const isLoading = (props: Props) => props.loading;

const errorStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  height: 300
};

const contentLoadingStyles = (props: Props) =>
  isLoading(props) ? { opacity: 0 } : { opacity: 1 };

const Wrapper = styled.div`
  background: ${props =>
    props.theme.baseColor ? props.theme.baseColor : "#FFF"};
  color: ${props =>
    Color(props.theme.baseColor).light()
      ? props.theme.darkText
      : props.theme.lightText};
  box-shadow: 0 0 32px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin: 10px;
  padding: 0;
  overflow: hidden;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  transition: 0.5s max-height ease-in;
  position: relative;
  max-height: 999px;
  min-height: 0;
  width: calc(100%);
  ${props =>
    props.loading
      ? css`
          justify-content: "center";
          align-items: "center";
          max-height: 200px;
          min-height: 200px;
        `
      : ""} @media print {
    display: ${props => (props.print ? "block" : "none")} !important;
    width: 100% !important;
    height: 100% !important;
    box-shadow: none !important;
  }
`;

class ErrorBoundaryComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, info);
  }

  refresh = () => {
    this.props.persistor.purge().then(() => {
      window.location.reload(true);
    });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Wrapper>
          <AHTitle>Hoppsan!</AHTitle>
          <AHTitle type="SUB">
            Där gick något fel, hoppas du förlåter mig.
          </AHTitle>
          <AHButton onClick={this.refresh}>Ladda om sidan</AHButton>
        </Wrapper>
      );
    }
    return this.props.children;
  }
}
const ErrorBoundary = withTheme(ErrorBoundaryComp);

class AHModuleUnthemed extends React.Component {
  state = {
    errorRefetch: false,
    hasTestedRefetch: false
  };

  componentWillReceiveProps(nextProps) {
    /// if the error fixed itself
    /// remove errorRefresh;
    if (!nextProps.error && this.state.errorRefetch) {
      this.setState({ errorRefetch: false });
    }
  }

  onErrorPress = () => {
   
    this.setState({ errorRefetch: true });
    this.props
      .refetch()
      .then(() => {
        this.setState({ errorRefetch: false, hasTestedRefetch: true });
      })
      .catch(() => {
        this.setState({ errorRefetch: false, hasTestedRefetch: true });
      });
  };

  testRefetch = () => this.props.testRefetch && !this.state.hasTestedRefetch

  render() {
    return (
      <ErrorBoundary>
        <Wrapper
          print={this.props.print}
          style={{
            ...this.props.style
          }}
          loading={this.props.loading}
          onClick={this.props.onClick}
        >
          {isLoading(this.props) && (
            <img
              alt="loading gif"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                marginLeft: -20,
                marginTop: -20,
                alignSelf: "center"
              }}
              width={40}
              src={require("./loading.gif")}
            />
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              transition: ".7s opacity ease-in",
              ...contentLoadingStyles(this.props),
              ...this.props.innerStyle
            }}
          >
            {(!!this.props.error || this.testRefetch()) ? (
              <div style={errorStyle}>
                <p style={{ margin: 0 }}>Ett fel inträffade.</p>
                <p style={{ margin: 0, marginBottom: 20 }}>
                  Kontrollera internetanslutning.
                </p>
                {this.props.refetch ? (
                  <AHButton
                    loading={this.state.errorRefetch}
                    onClick={this.onErrorPress}
                    disabled={false}
                  >
                    Ladda om
                  </AHButton>
                ) : null}
              </div>
            ) : (
              !isLoading(this.props) &&
              (this.props.render ? this.props.render() : this.props.children)
            )}
          </div>
        </Wrapper>
      </ErrorBoundary>
    );
  }
}

export const AHModule = withTheme(AHModuleUnthemed);
