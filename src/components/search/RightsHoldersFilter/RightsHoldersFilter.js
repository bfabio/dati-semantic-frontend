import React, { useEffect, useState } from "react";
import { array, bool, func } from "prop-types";
import sprite from "../../../assets/images/sprite.svg";
import { sortObjectsByAlphabeticalKey } from "../../../services/arrayUtils";
import parse from "html-react-parser";
import "./RightsHoldersFilter.css";

const RightsHoldersFilter = ({
  rightsHolders,
  onRightsHoldersUpdate,
  selection = [],
  keysAndLabels,
  isMobileFilter = false
}) => {
  const [value, setValue] = useState("");

  const idDropDown = isMobileFilter ? "dropdownMenuMobile" : "dropdownMenu";
  const idRightsHolderInput = isMobileFilter
    ? "rights-holders-input-mobile"
    : "rights-holders-input";
  const idRightsHolderFilter = isMobileFilter
    ? "rightsHolderFilterMobile"
    : "rightsHolderFilter";
  const idCheckOptions = isMobileFilter ? "check-mobile-" : "check-";

  const selectedOptions = selection.filter((el) => !rightsHolders.includes(el));

  const dropdownElementList = [].slice.call(
    document.querySelectorAll(".dropdown-toggle")
  );
  const dropdownElement = dropdownElementList
    .map(function (dropdownToggleEl) {
      return new bootstrap.Dropdown(dropdownToggleEl);
    })
    .find((el) => el._element.id == idRightsHolderFilter);

  const addToSelection = (toBeAdded) => () => {
    const arr =
      rightsHolders.length > 0 && isMobileFilter && selection.length != 0
        ? [...new Set([...selection, ...rightsHolders, toBeAdded])]
        : [...selection, toBeAdded];
    onRightsHoldersUpdate(arr);
    dropdownElement.show();
  };

  const removeFromSelection = (toBeRemove) => () => {
    onRightsHoldersUpdate(selection.filter((el) => el !== toBeRemove));
  };

  const onChangeInput = (value) => {
    dropdownElement.show();
    setValue(value);
  };

  const parseOption = (label) =>
    value != ""
      ? parse(
          label.replace(
            new RegExp(`(${value})`, "gi"),
            '<strong className="fw-bold text-primary">$1</strong>'
          )
        )
      : label;

  const optionArray = sortObjectsByAlphabeticalKey(
    keysAndLabels,
    "label"
  ).moveItemsToFront((item) => rightsHolders.includes(item.key));

  const optionsFiltered = optionArray.filter((el) =>
    el.label.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    if (dropdownElement) {
      document.addEventListener("click", (e) => {
        if (
          !e.target.closest(`#${idDropDown}`) &&
          !e.target.closest(".link-list-wrapper")
        )
          dropdownElement.hide();

        if (e.target.closest(`#${idRightsHolderInput}`)) {
          dropdownElement.show();
        }
      });
    }

    return () => {
      document.removeEventListener("click", (e) => {
        if (!e.target.closest(`#${idDropDown}`)) dropdownElement.hide();
        else if (e.target.closest("#wrapperListMobile")) dropdownElement.show();
        if (e.target.closest(`#${idRightsHolderInput}`)) {
          dropdownElement.show();
        }
      });
    };
  }, [dropdownElement]);

  return (
    <div className="d-grid" data-testid={idRightsHolderFilter}>
      {!isMobileFilter && (
        <table style={{ captionSide: "unset" }}>
          <caption
            htmlFor="rightsHolderFilter"
            className="pb-3 caption-title text-uppercase fw-semibold"
          >
            Filtra per titolare
          </caption>
        </table>
      )}
      <div
        id={idRightsHolderFilter}
        aria-labelledby={"Filtra_per_titolari"}
        className="dropdown dropdown-toggle px-0
            bg-red border-bottom border-secondary
            container-fluid row align-items-end"
      >
        <div className="input-group position-relative p-0">
          <span
            className="position-absolute"
            style={{ zIndex: 8, top: 6, left: 6 }}
            aria-hidden="true"
          >
            <svg className="icon icon-sm" fill="#5d7083">
              <use href={sprite + "#it-search"}></use>
            </svg>
          </span>
          <input
            role="searchbox"
            type="text"
            className={`form-control ${
              selectedOptions.length > 0 ? "selectedItems" : "notSelectedItems"
            }`}
            style={{ paddingLeft: "2.2rem" }}
            id={idRightsHolderInput}
            placeholder={`${
              selectedOptions.length > 0
                ? selectedOptions.length == 1
                  ? `1 opzione selezionata`
                  : `${selectedOptions.length} opzioni selezionate`
                : "Cerca per titolare"
            }`}
            name={idRightsHolderInput}
            value={value}
            onChange={(e) => onChangeInput(e.target.value)}
          />
        </div>
        {/* Dropdown with options */}
        <div id={idDropDown} className={`dropdown-menu w-100 p-0`}>
          <div className="link-list-wrapper">
            <ul
              id={isMobileFilter ? "wrapperListMobile" : "wrapperList"}
              className="link-list"
            >
              {optionsFiltered.length > 0 ? (
                optionsFiltered.map((option) => {
                  const checked = selection.includes(option.key);
                  const id = idCheckOptions + option.key;
                  const toggleSelection = checked
                    ? removeFromSelection(option.key)
                    : addToSelection(option.key);

                  return (
                    <li
                      className="form-check optionsDropdown px-2 py-1 mt-0"
                      key={option.key}
                    >
                      <input
                        type="checkbox"
                        id={id}
                        checked={checked}
                        data-testid="option"
                        onChange={toggleSelection}
                      />
                      <label
                        style={{ fontSize: "16px" }}
                        className={`${
                          checked ? "fw-semibold" : "fw-normal"
                        } text-wrap`}
                        htmlFor={id}
                      >
                        {parseOption(option.label)}
                      </label>
                    </li>
                  );
                })
              ) : (
                <li className="text-center">Nessun risultato</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

RightsHoldersFilter.propTypes = {
  rightsHolders: array.isRequired,
  onRightsHoldersUpdate: func.isRequired,
  selection: array,
  keysAndLabels: array,
  isMobileFilter: bool
};

RightsHoldersFilter.defaultProps = {};

export default RightsHoldersFilter;
