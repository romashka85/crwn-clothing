import React from 'react';
import { connect } from 'react-redux';
import { selectCollections } from '../../redux/shop/shop.selectors';
import  CollectionPreview from '../collection-preview/collection-preview-component';

import './collection-overview.styles.scss';

export const CollectionOverview = ({collections})=> (
  <div className="collection-overview">
    {collections.map(({id, ...otherCollectionProps}) => (
      <CollectionPreview key={id} {...otherCollectionProps}/>
    ))}
  </div>
)

const mapStateTopProps = state => ({
  collections: selectCollections(state)
});

export default connect(mapStateTopProps)(CollectionOverview);
