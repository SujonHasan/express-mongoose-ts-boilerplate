require('dotenv').config();
import {updateSeedRunnable} from "./index";
require('../config/mongoose');

updateSeedRunnable();
