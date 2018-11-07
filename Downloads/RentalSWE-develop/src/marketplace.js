import React, { Component } from 'react';
import App from "./App";
import {Redirect} from "react-router-dom"
import 'antd/dist/antd.css';
import { Layout, Form, Input, InputNumber, Icon, Card, Button, Col, Row, Menu, Modal} from 'antd';
import firebase from "./firebase";
const { Meta } = Card;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;
const InputGroup = Input.Group;
 export default class marketplace extends Component {
    constructor(props) {
    super(props);
    this.state = {
        name: "",
        userid: "",
        password: "",
        redirect: false,
        redirectTarget: "",
        items:[],
        itemCategory: "",
        search: "",
        searchBool: false,
        categoryKey: 1,
        allItems: true,
        minPrice: 0,
        maxPrice: 99999999,
        priceSearch: false
        };
    }
     redirect = e => {
       if(e != "/Marketplace"){
        this.setState({
            redirect: true,
            redirectTarget: e
        });
      }
    };

    search = e => {
      this.setState({
        search: e,
        searchBool: true,
        allItems: false,
        priceSearch: false,
      }, () => {
        this.getItems();
      })
    }

    handleCategory = e => {
       this.setState({
          itemCategory: e,
          searchBool: false,
          allItems: false,
          priceSearch: false,
       }, () => {
         this.getItems();
       });
   };

   allItems = e => {
     this.setState({
        allItems: true,
        priceSearch: false,
        itemCategory: ""
     }, () =>{
       this.getItems();
     })
   }

   handleUserInput = e => {
     this.setState({
       [e.target.id]: parseFloat(e.target.value)
     });
   };

   priceSearch = e => [
     this.setState({
       priceSearch: true,
       allItems: false,
       searchBool: false,
     }, () => {
       this.getItems();
     })
   ]



   getItems = e =>{
     console.log(this.state)
      const itemsRef = firebase.database().ref("items")
      itemsRef.on("value", snapshot => {
       let items = snapshot.val();
       let newState = [];
       for (let item in items) {
         const uppercaseName = items[item].itemName.toUpperCase()
         const uppercaseSearch = this.state.search.toUpperCase()
         //Array of items is populated with only the items that match the category selected
         if(items[item].itemCategory == this.state.itemCategory && !this.state.searchBool && !this.state.priceSearch && items[item].itemRented == false){
          newState.push({
             id: item,
             dateStamp: items[item].dateStamp,
             itemCategory: items[item].itemCategory,
             itemDescrip: items[item].itemDescrip,
             itemName: items[item].itemName,
             itemPrice: items[item].itemPrice,
             itemUID: items[item].itemUID,
             timeStamp: items[item].timeStamp,
             itemImages: items[item].itemImageSources
          });
        }
        //Array of items is populated with only the items that match the user search
        else if(uppercaseName.includes(uppercaseSearch) && this.state.searchBool == true && items[item].itemCategory == this.state.itemCategory && this.state.allItems == false && items[item].itemRented == false){
         newState.push({
            id: item,
            dateStamp: items[item].dateStamp,
            itemCategory: items[item].itemCategory,
            itemDescrip: items[item].itemDescrip,
            itemName: items[item].itemName,
            itemPrice: items[item].itemPrice,
            itemUID: items[item].itemUID,
            timeStamp: items[item].timeStamp,
            itemImages: items[item].itemImageSources
         });
       }
       //All items search
       else if(uppercaseName.includes(uppercaseSearch) && this.state.searchBool == true && this.state.itemCategory == "" && items[item].itemRented == false){
        newState.push({
           id: item,
           dateStamp: items[item].dateStamp,
           itemCategory: items[item].itemCategory,
           itemDescrip: items[item].itemDescrip,
           itemName: items[item].itemName,
           itemPrice: items[item].itemPrice,
           itemUID: items[item].itemUID,
           timeStamp: items[item].timeStamp,
           itemImages: items[item].itemImageSources
        });
      }
      //Array of items is populated with only the items that match the user price search
      else if(this.state.priceSearch && this.state.itemCategory != ""   && parseFloat(items[item].itemPrice) > this.state.minPrice && parseFloat(items[item].itemPrice) < this.state.maxPrice && items[item].itemCategory == this.state.itemCategory && items[item].itemRented == false){
       newState.push({
          id: item,
          dateStamp: items[item].dateStamp,
          itemCategory: items[item].itemCategory,
          itemDescrip: items[item].itemDescrip,
          itemName: items[item].itemName,
          itemPrice: items[item].itemPrice,
          itemUID: items[item].itemUID,
          timeStamp: items[item].timeStamp,
          itemImages: items[item].itemImageSources
       });
     }

      else if(this.state.priceSearch && this.state.itemCategory == ""  && parseFloat(items[item].itemPrice) > this.state.minPrice && parseFloat(items[item].itemPrice) < this.state.maxPrice && items[item].itemRented == false){
        newState.push({
           id: item,
           dateStamp: items[item].dateStamp,
           itemCategory: items[item].itemCategory,
           itemDescrip: items[item].itemDescrip,
           itemName: items[item].itemName,
           itemPrice: items[item].itemPrice,
           itemUID: items[item].itemUID,
           timeStamp: items[item].timeStamp,
           itemImages: items[item].itemImageSources
        });
      }
       //Array of items is populated with all items
       else if(this.state.allItems == true && items[item].itemRented == false){
        newState.push({
           id: item,
           dateStamp: items[item].dateStamp,
           itemCategory: items[item].itemCategory,
           itemDescrip: items[item].itemDescrip,
           itemName: items[item].itemName,
           itemPrice: items[item].itemPrice,
           itemUID: items[item].itemUID,
           timeStamp: items[item].timeStamp,
           itemImages: items[item].itemImageSources
        });
      }
       }
       console.log(newState)
       console.log(this.state.items)
       this.setState({
         items: newState.reverse()   //Change that later
       });
      });
      }

    componentDidMount(){
      this.getItems();
    }

     render() {
         //console.log(this.state)
        if(this.state.redirect == true){
            return <Redirect to= {this.state.redirectTarget} />;
        }
        return (
        <div>
        <div>
        <Layout>
            <Layout classname="layout-header">
                <Header>
                    <div className="logo" />
                    <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{ lineHeight: '64px' }}
                    >
                    <Menu.Item key="1" onClick={e => this.redirect("/Marketplace")}>Marketplace</Menu.Item>
                    <Menu.Item key="2" onClick={e => this.redirect("/Profile")}>Profile</Menu.Item>
                    <Menu.Item key="3" onClick={e => this.redirect("/VendorPage")}>Create Listing</Menu.Item>
                    </Menu>
                </Header>
            </Layout>
             <Layout className="layout-sider">
                <Sider width={300} style={{ background: '#fff' }}>
                    <Menu
                      mode="inline"
                      defaultSelectedKeys={['1']}
                      defaultOpenKeys={['sub1']}
                      style={{ height: '100%', borderRight: 0 }}
                    >
                      <SubMenu key="sub1" title={<span><Icon type="database" />Categories</span>}>
                        <Menu.Item key="1" onClick={e => this.allItems()}>All items</Menu.Item>
                        <Menu.Item key="2" onClick={e => this.handleCategory("Recreational")}>Recreational</Menu.Item>
                        <Menu.Item key="3" onClick={e => this.handleCategory("School Supplies")}>School Supplies</Menu.Item>
                        <Menu.Item key="4" onClick={e => this.handleCategory("Electronics")}>Electronics</Menu.Item>
                        <Menu.Item key="5" onClick={e => this.handleCategory("Miscellaneous")}>Miscellaneous</Menu.Item>
                    </SubMenu>
                    <InputGroup compact>
                        <Input style={{ width: 100, textAlign: 'center' }} type = "number" id = "minPrice" placeholder="Minimum" onChange={e => this.handleUserInput(e)}/>
                        <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                        <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }}type = "number"  id="maxPrice" placeholder="Maximum" onChange={e => this.handleUserInput(e)}/>
                    </InputGroup>
                    <Button type="primary" htmlType="submit" onClick={e => this.priceSearch()}> Update Search</Button>
                    <br/>
                    </Menu>
                </Sider>
                 <Layout className="layout-marketplace">
                <Layout classname="layout-search">
                <Search
                    placeholder="Search"
                    onSearch={value => this.search(value)}
                    style={{ width: 500, padding: 10 }}
                    display= "center"
                    enterButton
                 />
                </Layout>
                    <div style={{padding: '30px' }}>
                        <Row gutter={12}>
                {this.state.items.map(item => {
                return (
                    <Col span={8}>
                    <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img src= {item.itemImages[0]} />}
                    bordered = {true}
                    title={item.itemName}
                    onClick = {e => this.redirect('/Item/' + item.id )}
                    >
                    <Meta
                    title= {item.name}
                    //description={item.itemPrice}
                    />
                    <p> Price: {item.itemPrice} </p>
                    <div className="item-extra-meta" style={{margin: 10}}>
                    </div>
                    </Card>
                    </Col>
                    )
                })
            }
                        </Row>
                    </div>
                </Layout>
            </Layout>
        </Layout>
        </div>
        </div>
        );
    }
}
