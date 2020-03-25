class DatabaseWorker {
  constructor(databaseName, stores) {
    this.databaseName = databaseName;
    this.stores = stores;
  }

  initializeDatabase(v) {
    const request = indexedDB.open(this.databaseName, v);

    request.onupgradeneeded = () => {
      this.db = request.result;
      this.stores.forEach(store => {
        this.db.createObjectStore(store, {
          keyPath: 'ID',
          autoIncrement: true
        });
      });
    };

    return new Promise((res, rej) => {
      request.onsuccess = () => {
        console.log(
          'Database was initilized successfully!'
        );
        this.db = request.result;
        res(this.db);
      };

      request.onerror = () => {
        console.error(`Error: ${request.error}`);
        rej(`Error: ${request.error}`);
      };
    });
  }

  addToStore(storeName, data) {
    const request = this.db
      .transaction(storeName, 'readwrite')
      .objectStore(storeName)
      .add(data);
    request.onsuccess = () => {
      console.log('Data was saved successfully!');
    };
    request.onerror = () => {
      console.error(`Error: ${request.error}`);
    };
  }

  getByIDFromStore(storeName, ID) {
    const request = this.db
      .transaction(storeName, 'readwrite')
      .objectStore(storeName)
      .get(ID);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(`Error: ${request.error}`);
      };
    });
  }

  getAllFromStore(storeName) {
    const request = this.db
      .transaction([storeName], 'readwrite')
      .objectStore(storeName)
      .getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Data was successfully read!');

        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`Error: ${request.error}`);
      };
    });
  }

  clearStore(storeName) {
    const request = this.db
      .transaction(storeName, 'readwrite')
      .objectStore(storeName)
      .clear();

    request.onsuccess = () =>
      console.log(`${store} was successfully cleared!`);

    trarequestnsaction.onerror = () =>
      console.error(`Error: ${transaction.error}`);
  }

  deleteDatabase() {
    const request = indexedDB.deleteDatabase(
      this.databaseName
    );
    request.onsuccess = () => {
      console.log(`Database was deleted successfully`);
    };
    request.onerror = () => {
      console.log(`Database wasn't deleted`);
    };
  }
}

const dbWorker = new DatabaseWorker('testDB', [
  'news',
  'appeals'
]);
