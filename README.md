# MediChain Using Blockchain
## Introduction
### Blockchain
A blockchain, in general, is an immutable transaction record that is maintained within a distributed network of peer nodes. These nodes keep a copy of the ledger by applying transactions that have been validated by a consensus process and are organised into blocks with a hash that links each block to the one before it.

### HyperLedger Fabric
Hyperledger Fabric is an open source enterprise-grade permissioned distributed ledger technology (DLT) platform that offers some important advantages over other prominent DLT or blockchain platforms. The project is based on this framework essentially using all it components to develop a system to securely store, manage & migrate medical records in/within hospitals.

### Project Aim
- To develop a efficient Electronic Health Record (EHR) system to secure & manage patient medical records in hospital & enable patient privacy.
- To enable hospital organizations to track patient medical history & prevent overwrite of Electronic Health Records and prevent tampering of records.
- To promote transparency between the sharing of patient records requested on-demand by patient/doctor from a single person to other doctors/hospital organizations.
- To separate the control for clinical diagnosis & prognosis provided by doctors with the patient's personal health record provided by patients in electronic health record system.

### Recommended Platform
The most recommended platform is linux distribution, but if you want to run on windows, please install WSL2 Ubuntu or Kali.

## Usage
### Prerequisite
Before beginning, please confirm that you have installed all the prerequisites below on the machine.
- [Install Git](https://hyperledger-fabric.readthedocs.io/en/release-2.2/prereqs.html#install-git)
- [Install cURL](https://hyperledger-fabric.readthedocs.io/en/release-2.2/prereqs.html#install-curl)
- [Install Docker and Docker Compose](https://hyperledger-fabric.readthedocs.io/en/release-2.2/prereqs.html#docker-and-docker-compose)
- For Windows users, please ensure uname command is available to the binaries. Run below commands to make sure.
```git config --global core.autocrlf false
git config --global core.longpaths true```
