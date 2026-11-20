// Compatibility for the existing server; site-wide private storage survives deploys.
export function bucketFromStore(store) {
  return {
    async get(key) {
      const row = await store.getWithMetadata(key, {type:'text', consistency:'strong'});
      if (!row) return null;
      return {key, etag:row.etag, json:async()=>JSON.parse(row.data), text:async()=>row.data};
    },
    async put(key, value, options={}) {
      const condition = options.onlyIf || {};
      const result = await store.set(key, value, {
        ...(condition.etagMatches ? {onlyIfMatch:condition.etagMatches} : {}),
        ...(condition.etagDoesNotMatch === '*' ? {onlyIfNew:true} : {}),
      });
      return result.modified ? {key,etag:result.etag} : null;
    },
    async delete(key) { await store.delete(key); },
    async list({prefix='',limit=1000,cursor}={}) {
      const {blobs} = await store.list({prefix});
      const rows = [...blobs];
      // R2 lexicographic ordering must be deterministic, independent of locale.
      rows.sort((a,b)=>a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
      const after = cursor ? Buffer.from(cursor,'base64url').toString('utf8') : null;
      const remaining = after ? rows.filter(row=>row.key > after) : rows;
      const objects = remaining.slice(0,Math.max(1,Math.min(limit,1000)));
      const truncated = remaining.length > objects.length;
      return {objects,truncated,cursor:truncated ? Buffer.from(objects.at(-1).key).toString('base64url') : undefined};
    }
  };
}
