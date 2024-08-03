import { useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const Edit = () => {
    const [selectedCities, setSelectedCities] = useState(null);
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ];
    const animatedComponents = makeAnimated();
    console.log(options[0].value);
    
    return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={[options[0]]}
      isMulti
      options={options}
    />
    );
}

export default Edit;