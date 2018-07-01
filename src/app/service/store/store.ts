import {Observable} from 'rxjs';

export class Store {
  private readonly _name: string;
  private readonly _keyName: string | string[];
  private readonly _indexList: StoreIndex[];
  constructor(storeName: string, keyName: string | string[], indexList: StoreIndex[]) {
    this._name = storeName;
    this._keyName = keyName;
    this._indexList = indexList;
  }
  _initDB(): Observable<IDBDatabase> {
    return Observable.create(subscriber => {
      if (window.indexedDB) {
        const request = indexedDB.open('dongsunny');
        request.addEventListener('upgradeneeded', e => this._initStore(e.target['result']));
        request.addEventListener('success', e => {
          subscriber.next(e.target['result']);
          subscriber.complete();
        });
        request.addEventListener('error', e => subscriber.error(e));
      }
    });
  }
  _initStore(db: IDBDatabase) {
    const store = db.createObjectStore(this._name, {keyPath: this._keyName});
    this._indexList.forEach(storeIndex => {
      store.createIndex(storeIndex.name, storeIndex.index);
    });
  }
  _get(query: any, index?: string): Observable<any> {
    return Observable.create(subscriber => {
      const subscription = this._initDB().subscribe(db => {
        const store = db.transaction(this._name).objectStore(this._name);
        const req = index ? store.index(index) : store;
        const result = [];
        req.openCursor().onsuccess = e => {
          const cursor = e.target['result'];
          if (cursor) {
            result.push(cursor.value);
            cursor.continue();
          } else {
            subscriber.next(result);
            subscriber.complete();
          }
        };
        subscription.unsubscribe();
      });
        /*const req = index ? store.index(index).getAll(query) : store.getAll(query);
        req.onsuccess = e => {
          subscriber.next(e);
          subscriber.complete();
        };
        req.onerror = e => {
          subscriber.error(e);
        }
        subscription.unsubscribe();
      });*/
    });
  }
  _add(document: any): Observable<any> {
    return Observable.create(subscriber => {
      const subscription = this._initDB().subscribe(db => {
        const store = db.transaction(this._name, 'readwrite').objectStore(this._name);
        const req = store.put(document);
        req.onsuccess = e => {
          subscriber.next(e);
          subscriber.complete();
        };
        req.onerror = e => {
          subscriber.error(e);
        }
        subscription.unsubscribe();
      });
    });
  }
}

export interface StoreIndex {
  name: string;
  index: string | string[];
}
