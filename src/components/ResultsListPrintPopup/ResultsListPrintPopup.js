import {
  useEffect,
  useRef,
} from 'react';
import { useIntl } from 'react-intl';
import { useReactToPrint } from 'react-to-print';
import PropTypes from 'prop-types';

import { searchResultListColumns } from '@folio/stripes-authority-components';

import css from './ResultsListPrintPopup.css';

const columnLabelIds = {
  [searchResultListColumns.AUTH_REF_TYPE]: 'stripes-authority-components.search-results-list.authRefType',
  [searchResultListColumns.HEADING_REF]: 'stripes-authority-components.search-results-list.headingRef',
  [searchResultListColumns.HEADING_TYPE]: 'stripes-authority-components.search-results-list.headingType',
  [searchResultListColumns.AUTHORITY_SOURCE]: 'stripes-authority-components.search-results-list.authoritySource',
  [searchResultListColumns.NUMBER_OF_TITLES]: 'ui-marc-authorities.search-results-list.numberOfTitles',
};

const propTypes = {
  authorities: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAfterPrint: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const ResultsListPrintPopup = ({
  authorities,
  onAfterPrint,
  visibleColumns,
}) => {
  const intl = useIntl();
  const contentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrintRef.current,
    pageStyle: `
      @page {
        size: A4 auto;
        margin: 30px;
      }

      @media print {
        html, body {
          height: auto !important;
          overflow: initial !important;
          color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
      }
    `,
    onAfterPrint,
  });

  useEffect(() => {
    handlePrint();
  }, [handlePrint]);

  const columns = visibleColumns
    .filter(column => column !== searchResultListColumns.SELECT)
    .filter(column => columnLabelIds[column]);

  return (
    <div className={css.hidden}>
      <div ref={contentToPrintRef} data-testid="print-results-popup">
        <h2 className={css.title}>
          {intl.formatMessage({ id: 'stripes-authority-components.meta.title' })}
        </h2>
        <table className={css.table}>
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column}>
                  {intl.formatMessage({ id: columnLabelIds[column] || column })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {authorities.map(authority => (
              <tr key={authority.id}>
                {columns.map(column => (
                  <td key={column}>{authority[column] ?? ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ResultsListPrintPopup.propTypes = propTypes;

export default ResultsListPrintPopup;
