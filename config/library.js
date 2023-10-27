const dotenv = require('dotenv');
const https = require('https');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = {
    dotenv,
    https,
    fs,
    express,
    mongoose,
    bcrypt,
    jwt,
    crypto
}