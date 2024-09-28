const tourismGovernerModel = require("../Models/tourismGoverner.js"); 
const { default: mongoose } = require('mongoose');
const bcrypt = require("bcrypt");


//Read
const getPlaces = async (req,res) =>{
    try{
        const {UserName, Description,Pictures, Location, OpeningHours, TicketPrices}=req.body;
        const places=await tourismGovernerModel.find({});
        res.status(200).json(places);
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
};


//Create
const createPlace = async (req,res) =>{
    try{
        const {UserName, Description,Pictures, Location, OpeningHours, TicketPrices}=req.body;
        const newPlace = await tourismGovernerModel.create({UserName, Description,Pictures, Location,
            OpeningHours, TicketPrices});
            res.status(201).json(newPlace);
            }
            catch(error){
                res.status(400).json({message:error.message});
                }
                };



//Update
const updatePlace = async (req,res) =>{
    try{
        const {UserName, Description,Pictures, Location, OpeningHours, TicketPrices}=req.body;
        const place = await tourismGovernerModel.find({UserName},{UserName, Description,Pictures, Location, OpeningHours, TicketPrices});
        if(!place){
            return res.status(404).json({message:"Place not found"});
            }
            else{
                res.status(200).json(place);
                }
            }catch(error){
                res.status(400).json({message:error.message});
            }
            };



//Delete
const deletePlace = async (req,res) =>{
    try{
        const {UserName}=req.body;
        const place = await tourismGovernerModel.find({UserName});
        if(!place){
            return res.status(404).json({message:"Place not found"});
            }
            else{
                await tourismGovernerModel.deleteOne({UserName});
                res.status(200).json({message:"Place deleted"});
                }
                }
                catch(error){
                    res.status(400).json({message:error.message});
                    }
                    };



module.exports ={getPlaces, createPlace, updatePlace, deletePlace};