import { cilArrowThickToTop, cilCheck, cilX } from '@coreui/icons';
import { CTableProps } from '@coreui/react-pro/dist/components/table/CTable';
import { TextColors } from '@coreui/react-pro/dist/components/Types';
import { IParams } from 'src/components/dashboard/dashboard.api';

export function checkIfFileIsCsv(file: any): boolean {
  return file.type.includes('csv');
}

enum KeywordStats {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}
interface IGetKwStatusOutput {
  text: KeywordStats;
  color: TextColors;
  icon: any;
}

// if (success === null) {
//   return cilArrowThickToTop;
// }
// if (success) {
//   return cilCheck;
// } else {
//   return cilX;
// }

export const getKeywordStatus = (success: null | boolean): IGetKwStatusOutput => {
  if (success === null) {
    return { text: KeywordStats.PENDING, color: 'warning', icon: cilArrowThickToTop };
  }
  if (success) {
    return { text: KeywordStats.SUCCESS, color: 'success', icon: cilCheck };
  } else {
    return { text: KeywordStats.FAILED, color: 'danger', icon: cilX };
  }
};

export const createIndexes = <T, G extends IParams>(data: T[], filter: G) => {
  const { page, size } = filter;
  return data.map((element, index) => ({
    ...element,
    index: page * size + index + 1,
  }));
};

export const tableProps: CTableProps = {
  striped: true,
  hover: true,
  align: 'middle',
  bordered: true,
  responsive: 'xl'
};
