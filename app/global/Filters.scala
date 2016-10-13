package global

/**
  * Created by cmathew on 13.10.16.
  */
import javax.inject.Inject

import play.api.http.DefaultHttpFilters


class Filters @Inject() (
                          auth: AuthorisationFilter
                        ) extends DefaultHttpFilters(auth)


