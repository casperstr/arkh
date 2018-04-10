// @flow
import React from "react";
import styles from "./AHInput.css";

export const AHInput = (props: any) => {
  const { error, wrapperStyle, ...ownProps } = props;
  return (
    <div
      className={styles.inputWrapper}
      style={wrapperStyle}
    >
      <div className={styles.error}>
        {error}
      </div>
      <input autoFocus={props.autoFocus} className={styles.input} {...ownProps} style={props.style} />
    </div>
  );
};

export const AHTextArea = (props: any) => {
  const { error, ...ownProps } = props;
  return (
    <div
      className={styles.inputWrapper}
   
    >
      <div className={styles.error}>
        {error}
      </div>
      <textarea rows={4} className={styles.input} {...ownProps} style={{height: 60, ...props.style}} />
    </div>
  );
};
