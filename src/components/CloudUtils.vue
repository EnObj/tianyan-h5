<script>
export default {
  getAll(query) {
    return getByPage(query, []);
  },
};
const pageSize = 20;
function getByPage(query, list) {
  return query
    .skip(list.length)
    .limit(pageSize)
    .get()
    .then((res) => {
      if (res.data.length == pageSize) {
        return getByPage(query, list.concat(res.data));
      }
      return list.concat(res.data);
    });
}
</script>