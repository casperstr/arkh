// @flow
import React, { Children, PureComponent } from "react";
import styles from "./AHButton.css";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome";
import { withTheme, AHThemeType } from "../AHTheme/AHTheme";
import { AHShakeableClickArea } from "../AHShakeableClickArea/AHShakeableClickArea";
import { SubmitButton } from "./SubmitButton";
type AHButtonTypes = "NORMAL" | "NEGATIVE" | "POSITIVE";

const typeStyles = (type: AHButtonTypes, theme: AHThemeType) =>
  ({
    NORMAL: {
      background: "#EEEEEE",
      color: theme.darkText
    },
    IMPORTANT: {
      background: theme.washedText,
      color: "#fff"
    },
    NEGATIVE: {
      background: theme.negativeColor,
      color: "#fff"
    },
    POSITIVE: {
      background: theme.positiveColor,
      color: "#fff"
    },
    SUBMIT: {}
  }[type]);

class AHButtonUnthemed extends PureComponent {
  
  props: {
    children?: Children,
    type: AHButtonTypes,
    theme: AHThemeType,
    onClick: Event => void,
    style?: any,
    disabled: boolean,
    loading: boolean
  };

  static defaultProps = {
    type: "NORMAL",
    onClick: () => {}
  };

  displayName = "AHButton";

  renderLoading = () =>  <FontAwesome name="spinner" /> //<i className="fa fa-spinner fa-spin fa-1x fa-fw" />;

  render() {
    return this.props.type === "SUBMIT" ? <SubmitButton {...this.props} />: (
      <div
        onClick={
          this.props.disabled || this.props.loading
            ? () => {}
            : this.props.onClick
        }
        style={{
          ...typeStyles(this.props.type, this.props.theme),
          ...this.props.style
        }}
        className={
          styles.button +
          " " +
          (this.props.disabled ? styles.disabled : "") +
          " " +
          (this.props.loading ? styles.loading : "")
        }
      >
        <AHShakeableClickArea shouldShake={this.props.disabled}>
          <label className={styles.buttonLabel}>
            {this.props.loading ? this.renderLoading() : this.props.children}
          </label>
        </AHShakeableClickArea>
      </div>
    );
  }
}

export const AHButton = withTheme(AHButtonUnthemed);

