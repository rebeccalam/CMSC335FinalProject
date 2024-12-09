import fs from 'fs/promises';
import path from 'path';
import express from 'express';
import Suspect from './Suspect.js';
import { fetchAllPages } from './fetchPages.js';
import { fetchAllPagesTest } from './fetchPagesTest.js';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

export {fs, path, express, Suspect, fetchAllPages, fetchAllPagesTest, fileURLToPath, dotenv, MongoClient, ServerApiVersion };