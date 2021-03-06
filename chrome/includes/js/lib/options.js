/* globals XMLHttpRequest, $, localStorage */
$(document).ready(function () {
  options.displayCategories()
})

var options = {
  displayError: function () {
    $('#error-container').show()
  },
  dismissError: function () {
    $('#error-container').hide()
  },
  displayCategories: function () {
    $('#category-list').empty()
    var len, iter, subreddit
    len = localStorage.length
    for (iter = 0; iter < len; iter++) {
      subreddit = localStorage.key(iter)
      $('#category-list').append('<li><p>' + '<a class="delete-category" id="lement' + iter + '" href="#"><span class="icon-cross"></span></a><span id="element' + iter + '">' + subreddit + '</span></p></li>')
    }
  },
  addCategory: function (input) {
    var resp = this.checkCategory(input)
    if (resp === 1) {
      this.displayError()
    } else {
      localStorage.setItem(resp['subreddit'], resp['url'])
      console.log('Added: ' + resp)
      this.displayCategories()
    }
  },
  checkCategory: function (input) {
    var xhr, url, status, jsonData, result
    xhr = new XMLHttpRequest()
    url = 'https://www.reddit.com/' + input
    if (url.slice(-1) === '/') {
      url = url.slice(0, -1)
    }
    xhr.open('GET', url + '/top/.json?limit=1', false)
    xhr.send()
    status = xhr.status
    console.log(status)
    if (status !== 200) {
      return 1
    } else {
      console.log(xhr.responseText)
      jsonData = JSON.parse(xhr.responseText)
      try {
        result = {
          'subreddit': jsonData['data']['children'][0]['data']['subreddit'],
          'url': url
        }
      } catch (e) {
        return 1
      }
      return result
    }
  },
  deleteCategory: function (subreddit) {
    localStorage.removeItem(subreddit)
    this.displayCategories()
  }
}

/*
 * Add Listeners
 */

$('#error-container').hide()

$('.dismiss-error').on('click', options.dismissError)
$('#target').submit(function () {
  var input = $('#target :input')
  var values = {}
  input.each(function () {
    values['url'] = $(this).val()
  })
  options.addCategory(values['url'])
  return false
})

$(document).on('click', '.delete-category', function () {
  var id, key
  id = $(this).attr('id')
  id = 'e' + id
  key = $('#' + id).text()
  console.log(id)
  options.deleteCategory(key)
})
