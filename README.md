<<<<<<< Updated upstream
# Telemedicine
=======
**General system requirements**
The application allows the creation and deletion of patient and doctor accounts. It has a database to store consultation data, doctor information, messages, patients, and prescriptions. Users are able to upload a profile picture. The system allows contact between one or more doctors, and doctors are able to communicate with other doctors and patients. User passwords are encrypted. Doctors are able to prescribe medications, and patients or pharmacies are able to view their prescriptions by entering a code. Users have the ability to close their accounts. The application is implemented as a single-page application (SPA) and uses AJAX.

**Use Cases**
**Patients**
Patients should be able to perform consultations, delete their accounts, view their prescriptions, and send messages.

User: pacienteRaul@gmail.com (two conversations have been created, one with a single doctor and the other with two doctors)
User: pacienteNoVerificado@gmail.com (this account is unverified and should demonstrate that unverified accounts cannot log in and will always be redirected to the login page)
**Doctors**
Doctors should be able to prescribe medications, delete prescriptions, answer messages, and communicate with other doctors or patients.

User: gregorio@comem.es (member of a conversation with two doctors and prescribes a medication)
User: ramonycajal@comem.es (member of a conversation with two doctors)
User: pediatra@comem.es (member of a conversation with one patient and prescribes a medication)
**Usage guide**
The password for all users is 123.

To communicate with a doctor, patients should initiate a consultation and specify the desired specialty. Patients can only communicate with doctors of the same specialty, not with dermatologists and cardiologists at the same time, for example.

When a user closes their account, an email will be sent to both the patient and doctor.

When a doctor prescribes a medication, patients can view the prescription in the "Your Prescriptions" section.

Each patient has a primary doctor, so it is not possible to delete Dr. Gregorio, as he is the foreign key for all patients. If you wish to delete Dr. Gregorio, you must first create another doctor and then delete Dr. Gregorio.

Messages that have not been read yet will have a red background, while messages that have been read will have a green background.
>>>>>>> Stashed changes
