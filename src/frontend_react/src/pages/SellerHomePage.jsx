import React from 'react';
import SellerProfileManager from "./SellerProfileInformation";
import HeaderSE from '../components/headerSE';
import SellerNavBar from '../components/sellerNavBar';

const SellerHomePage = () =>{

    return(

        <div>
            <SellerNavBar/>
            <HeaderSE />
            <SellerProfileManager/>
        </div>


    );


};

export default SellerHomePage;