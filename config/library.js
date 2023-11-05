const dotenv = require('dotenv');
const https = require('https');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const momentJs = require('moment');
const helmet = require('helmet');
const morgan = require('morgan');
const expressBrute = require('express-brute');
const path = require('path');

module.exports = {
    dotenv,
    https,
    fs,
    express,
    mongoose,
    bcrypt,
    jwt,
    crypto,
    momentJs,
    helmet,
    morgan,
    expressBrute,
    path
}