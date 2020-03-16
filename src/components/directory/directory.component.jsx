import React from 'react';
import { connect } from 'react-redux';

import { selectDirectorySection } from '../../redux/directory/directory.selectors';

import MenuItem from '../menu-item/menu-item.component'


const Directory = ({sections}) => (
  
  <div className='directory-menu'>
    {sections.map(({id, ...otherSectionProps}) => (
        <MenuItem  key={id} {...otherSectionProps}/>
    ))}
  </div>
);

const mapStateToProps = (state) => ({
  sections: selectDirectorySection(state)
})

export default connect(mapStateToProps)(Directory);