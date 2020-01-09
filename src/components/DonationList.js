import React, { Component } from 'react';
import Header from './Header';
import DonationItem from './DonationItem';
import styled from 'styled-components';
import { numberToText } from '../myModule';
import db from '../firebase';

const MainBlock = styled.div`
  display: flex;
`;

const DonationListBlock = styled.div`
  flex: auto;
  background-color: #f9f9f9;

  .center {
    height: 5em;
    line-height: 5em;
    background-color: black;
    color: white;
    text-align: center;
    font-size: 36px;
  }
`;

class DonationList extends Component {
  state = {
    donations: null,
    year: this.props.match.params.year || 'all'
  };

  loadData = async () => {
    try {
      console.log(`############로드데이터########`);
      const year = this.state.year;

      let resDonationData;
      let donationRef = db.collection('donation');
      if (year === 'all') {
        resDonationData = await donationRef.orderBy('date', 'desc').get();
      } else {
        resDonationData = await donationRef
          .where('date', '>=', `${year}0101`)
          .where('date', '<=', `${year}1231`)
          .orderBy('date', 'desc')
          .get();
      }

      this.setState({
        donations: resDonationData.docs.map(doc => {
          // console.log(doc.id, '=>', doc.data());
          return {
            ...doc.data(),
            id: doc.id
          };
        })
      });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.loadData();
  }

  render() {
    const { donations } = this.state;
    if (!donations) {
      return (
        <MainBlock>
          <Header category={'donation'} />
          <div></div>
        </MainBlock>
      );
    }

    return (
      <MainBlock>
        <Header category={'donation'} />
        <DonationListBlock>
          <div className="center">
            <b>{numberToText(205732190000)}</b>
          </div>
          {/* <div>시간순 금액순</div> */}

          {donations.map(value => {
            // return <div>{value.id}</div>;
            return <DonationItem key={value.id} {...value} />;
          })}
        </DonationListBlock>
      </MainBlock>
    );
  }
}

export default DonationList;
