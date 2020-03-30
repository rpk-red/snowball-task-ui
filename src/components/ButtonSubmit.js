import React from 'react'
import PropTypes from 'prop-types'
import styled from "styled-components";
import { statusEnum } from '../assets/constants/appConstants';

const StyledButtonSubmit = styled.button`
  padding: 12px;
  background: rgb(102, 202, 249);
  border: 0;
  color: white;
  border-radius: 3px;
  font-weight: 500;
  font-size: 10pt;
  cursor: pointer;
  max-width: 130px;
  &:hover {
  background: rgba(15, 127, 255, 0.9);
  color: white
  };
  &:disabled  {
  background: #efefef;
  color: lightgrey
  };
`;


const ButtonSubmit = ({ onClick, status, uploading }) => {
  return (
    <StyledButtonSubmit
      id="button-submit"
      name="button-submit"
      type="submit"
      onClick={onClick}
      disabled={status !== statusEnum.PREVIEW || uploading}
    >
      Upload image
    </StyledButtonSubmit>

  )
}

ButtonSubmit.propTypes = {
  onClick: PropTypes.func,
  preview: PropTypes.string,
  uploading: PropTypes.bool
}

export default ButtonSubmit
