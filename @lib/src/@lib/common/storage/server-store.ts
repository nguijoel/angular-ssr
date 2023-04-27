
export class ServerStorage implements Storage {
  
    /**
    * number of stored items.
    */
    private $length: number;
    private cache: any = {};
    constructor() {
        this.$length = 0
    }


    get length(): number { return this.$length; }

    [name: string]: any;

   /**
   * removes all stored items and sets length to 0
   *
   * @returns {undefined}
   */
    clear(): void  {
        this.cache = {}
        this.$length = 0
    }

      /**
   * returns name of key at passed index
   *
   * @para {Number} index
   *       Position for key to be returned (starts at 0)
   * @returns {String|null}
   */
    key(index: number): string | null {
        return Object.keys(this.cache)[index] || null
    }

    /**
    * returns item for passed key, or null
    *
    * @para {String} key
    *       name of item to be returned
    * @returns {String|null}
    */
    getItem(key: string): string | null {

        if (key in this.cache) return this.cache[key];
        else return null
    }

    /**
    * sets item for key to passed value, as String
    *
    * @para {String} key
    *       name of item to be set
    * @para {String} value
    *       value, will always be turned into a String
    * @returns {undefined}
    */
    setItem(key: string, value: string): void {
        if (typeof value === 'undefined') this.removeItem(key)
        else {
            if (!Object.prototype.hasOwnProperty.call(this.cache, key)) this.$length++;
            this.cache[key] = '' + value
        }
    }

   /**
   * removes item for passed key
   *
   * @para {String} key
   *       name of item to be removed
   * @returns {undefined}
   */
    removeItem(key: string): void {
        if (Object.prototype.hasOwnProperty.call(this.cache, key)) {
          delete this.cache[key];
          this.$length--
        }
      }

      private static $store :ServerStorage;
      private static $local :ServerStorage;

      static get session(): ServerStorage { return ServerStorage.$store || (ServerStorage.$store = new ServerStorage());}
      static get local(): ServerStorage { return ServerStorage.$local || (ServerStorage.$local = new ServerStorage());}
}





