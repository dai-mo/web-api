package global

/**
  * Created by cmathew on 13.10.16.
  */
import javax.inject.Inject

import play.api.http.DefaultHttpFilters
import play.filters.cors.CORSFilter


class Filters @Inject() (corsFilter: CORSFilter) extends DefaultHttpFilters(corsFilter)


