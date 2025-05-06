const arr = [1, 2, 5, 23, 7, 1, 2, 5, 6, 212, 222, 33, 11, 26, 34];

//**************** 冒泡 ********************

function sort(arr) {
  const length = arr.length;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - i; j++) {
      if (arr[j] >= arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

// console.log(sort(arr))

//**************** 快速排序 ********************

function swap(nums, i, j) {
  const temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}

function helper(nums, l, r) {
  const left = l;
  const standard = nums[l];
  while (l < r) {
    while (l < r && nums[r] >= standard) r--;
    while (l < r && nums[l] <= standard) l++;
    swap(nums, l, r);
  }
  swap(nums, left, l);
  return l;
}

function quickSort(nums, left = 0, right = nums.length - 1) {
  if (left >= right) return;

  const index = helper(nums, left, right);
  quickSort(nums, left, index - 1);
  quickSort(nums, index + 1, right);
}
console.log(1);
quickSort(arr);
console.log(arr);
