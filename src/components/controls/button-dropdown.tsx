import Button, { ButtonType } from './button';
import Dropdown, { DropdownType } from './dropdown';

type ButtonDropdownType = {
  button?: ButtonType;
  dropdown?: DropdownType;
};

function ButtonDropdown({ button, dropdown }: ButtonDropdownType) {
  return (
    <Dropdown placement="bottomLeft" trigger={['click']} {...dropdown}>
      <Button
        // className="bg-gray-200 border-gray-300 hover:!border-gray-200 hover:!bg-gray-100 hover:!text-gray-700 dark:bg-gray-600 dark:border-gray-700 hover:dark:!border-gray-800 hover:dark:!bg-gray-700 hover:dark:!text-gray-400"
        iconClass=""
        type="default"
        {...button}
      />
    </Dropdown>
  );
}

export default ButtonDropdown;
